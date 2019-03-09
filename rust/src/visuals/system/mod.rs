//! The actual implementation of the [`Visuals`] system
use std::collections::HashMap;
use std::thread;
use std::path::PathBuf;
use std::sync::{Arc, RwLock};
use std::sync::mpsc::{channel, Sender};

use specs::prelude::*;
use sdl2::render::{Texture, TextureCreator, WindowCanvas, TextureQuery};
use sdl2::image::LoadSurface;
use sdl2::video::WindowContext;
use sdl2::surface::Surface;
use sdl2::image::LoadTexture;
use sdl2::ttf::{Font as SDLFont, Sdl2TtfContext};
use sdl2::pixels::PixelFormatEnum;

use crate::camera::Camera;
use crate::model::shape::*;
use super::{
    tile::*,
    image::Image,
    font::Font,
    color::Color,
    drawable::Drawable,
};
use crate::loading::IsLoading;

mod main_canvas;
use self::main_canvas::MainCanvas;

// helper type to wrap up these two other options
enum ToDraw<'a> {
    Drawable(&'a Box<dyn Drawable>),
    TileGrid(&'a mut TileGrid, i32),
}

impl<'a> ToDraw<'a> {
    fn depth(&self) -> i32 {
        match self {
            &ToDraw::Drawable(ref drawable) => drawable.depth(),
            &ToDraw::TileGrid(_, depth) => depth,
        }
    }
}

#[derive(Clone, Debug)]
enum Load {
    Available(PathBuf),
    Loading,
}

struct BuildRequest {
    depth: i32,
    path: PathBuf,
    tile_size: Dimen,
    size: Dimen,
    tiles: Vec<Option<Tile>>,
}

pub(crate) struct Visuals<'ttf> {
    size: Dimen,
    canvas: WindowCanvas,
    texture_creator: TextureCreator<WindowContext>,
    ttf_context: &'ttf Sdl2TtfContext,
    // TODO: replace this with some cache that forgets things that aren't needed anymore
    textures: HashMap<PathBuf, Result<Texture, String>>,
    // TODO: replace this with some cache that forgets things that aren't needed anymore
    fonts: HashMap<Font, Result<SDLFont<'ttf, 'static>, String>>,
    rendered_tiles: Arc<RwLock<HashMap<i32, Load>>>,
    build_tile_map: Sender<BuildRequest>,
}

impl<'ttf> Visuals<'ttf> {
    pub(crate) fn new(size: Dimen, canvas: WindowCanvas, ttf_context: &'ttf Sdl2TtfContext) -> Self {
        let texture_creator = canvas.texture_creator();
        let rendered_tiles: Arc<RwLock<HashMap<i32, Load>>> = Arc::default();

        let (sx, rx) = channel::<BuildRequest>();
        let rendered_tiles_cp = rendered_tiles.clone();
        thread::spawn(move || {
            for BuildRequest { depth, path, tile_size, size, tiles } in rx.iter() {
                match render_tile_grid_to_file(&path, tile_size, size, tiles.iter()) {
                    Ok(()) => {
                        rendered_tiles_cp.write().unwrap().insert(depth, Load::Available(path));
                    }
                    Err(error) => {
                        panic!("Failed to render tiles: {:?}", error);
                    }
                }
            }
        });

        Visuals {
            size,
            canvas,
            texture_creator,
            ttf_context,
            textures: HashMap::new(),
            fonts: HashMap::new(),
            rendered_tiles,
            build_tile_map: sx,
        }
    }
}

impl<'ttf> Visuals<'ttf> {
    fn draw(&mut self, drawable: &dyn Drawable, camera: Camera) -> crate::Result<()> {
        drawable.render(&mut MainCanvas::new(self, camera))
    }

    fn draw_image_at_path(&mut self, path: PathBuf, position: Point, camera: Camera) -> crate::Result<()> {
        let texture_creator = &mut self.texture_creator;
        let texture = self.textures.entry(path.clone()).or_insert_with(|| texture_creator.load_texture(path));
        match texture {
            Ok(texture) => {
                let TextureQuery { width, height, .. } = texture.query();
                self.canvas.copy(
                    &texture,
                    None,
                    Some(Rect::from(position, Dimen::new(width, height)).transform(camera.input, camera.output).into())
                )?;
                Ok(())
            }
            Err(error) => return Err(error.clone().into()),
        }
    }
}

fn render_tile_grid_to_file<'a>(path: &PathBuf, tile_size: Dimen, size: Dimen, tiles: impl Iterator<Item = &'a Option<Tile>>) -> crate::Result<()> {
    let mut surface = Surface::new(
        size.width * tile_size.width,
        size.height * tile_size.height,
        PixelFormatEnum::RGBA8888,
    )?;
    let mut surfaces: HashMap<Image, Result<Surface<'_>, String>> = HashMap::default();
    for (index, tile) in tiles.enumerate() {
        if let Some(tile) = tile {
            let image_surface = surfaces
                .entry(*tile.tile_set.image())
                .or_insert_with(|| Surface::from_file(tile.tile_set.image()));
            match image_surface {
                Ok(image_surface) => {
                    let frame = tile.tile_set.cell(tile.index);
                    let point = Point::new(
                        (index as u32 % size.width * tile_size.width) as i32,
                        (index as u32 / size.width * tile_size.height) as i32,
                    );
                    image_surface.blit(
                        Some(frame.into()),
                        &mut surface,
                        Some(Rect::from(point, frame.dimen()).into()),
                    )?;
                }
                Err(error) => return Err(error.clone().into()),
            }
        }
    }
    surface.save_bmp(&path)?;
    Ok(())
}

impl<'a, 'ttf> System<'a> for Visuals<'ttf> {
    type SystemData = (ReadStorage<'a, Box<dyn Drawable>>, Write<'a, TileLayers>, Read<'a, Camera>, Write<'a, IsLoading>);

    fn run(&mut self, (drawable, mut tile_layers, camera, mut is_loading): Self::SystemData) {
        is_loading.0 = false;
        self.canvas.set_draw_color(Color::rgb(0, 0, 0));
        self.canvas.clear();
        self.canvas.set_draw_color(Color::rgb(255, 0, 0));
        let mut to_draw: Vec<_> = drawable.join()
            .map(|it| ToDraw::Drawable(it))
            .chain(tile_layers.iter_mut().map(|(depth, tiles)| ToDraw::TileGrid(tiles, *depth)))
            .collect();
        to_draw.sort_by_key(|it| it.depth());
        for drawable in to_draw {
            match drawable {
                ToDraw::Drawable(drawable) => {
                    if let Err(error) = self.draw(&**drawable, *camera) {
                        panic!("Failed to draw drawable: {:?}", error);
                    }
                }
                ToDraw::TileGrid(tile_grid, depth) => {
                    if tile_grid.is_dirty() {
                        tile_grid.set_clean();
                        if let Some(tile_size) = tile_grid.tile_size() {
                            self.rendered_tiles.write().unwrap().insert(depth, Load::Loading);
                            let tiles = tile_grid.tiles();
                            let size = tile_grid.size();
                            let mut path = tiles_dir!();
                            path.push(format!("{}.bmp", depth));
                            self.textures.remove(&path);
                            self.build_tile_map.send(BuildRequest {
                                depth,
                                path,
                                tile_size,
                                size,
                                tiles,
                            }).unwrap();
                        } else {
                            self.rendered_tiles.write().unwrap().remove(&depth);
                        }
                    }
                    let loaded_tile_grid = self.rendered_tiles.read().unwrap().get(&depth).cloned();
                    match loaded_tile_grid {
                        Some(Load::Available(path)) =>
                            if let Err(error) = self.draw_image_at_path(path.clone(), tile_grid.offset(), *camera) {
                                panic!("Failed to draw rendered tiles: {:?}", error);
                            }
                        Some(Load::Loading) => is_loading.0 = true,
                        None => (),
                    }
                }
            }
        }
        self.canvas.present();
    }
}
