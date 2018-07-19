//! The actual implementation of the [`Visuals`] system
use std::collections::HashMap;

use specs::prelude::*;
use sdl2::render::{Texture, TextureCreator, Canvas as SDLCanvas, WindowCanvas, TextureQuery};
use sdl2::video::WindowContext;
use sdl2::surface::Surface;
use sdl2::image::LoadTexture;
use sdl2::ttf::{Font as SDLFont, Sdl2TtfContext};
use sdl2::pixels::{Color as SDLColor, PixelFormatEnum};

use model::shape::*;

use camera::Camera;

use super::canvas::Canvas;
use super::drawable::*;
use super::image::Image;
use super::font::Font;
use super::color::Color;
use super::sprite::Sprite;
use super::tile::*;

// helper type to wrap up these two other options
enum ToDraw<'a> {
    Drawable(&'a Box<dyn Drawable>),
    TileGrid(&'a mut TileGrid, i32),
}

impl<'a> ToDraw<'a> {
    pub fn depth(&self) -> i32 {
        match self {
            &ToDraw::Drawable(ref drawable) => drawable.depth(),
            &ToDraw::TileGrid(_, depth) => depth,
        }
    }
}

pub(crate) struct Visuals<'ttf> {
    canvas: WindowCanvas,
    texture_creator: TextureCreator<WindowContext>,
    ttf_context: &'ttf Sdl2TtfContext,
    // TODO: replace this with some cache that forgets things that aren't needed anymore
    textures: HashMap<Image, Texture>,
    // TODO: replace this with some cache that forgets things that aren't needed anymore
    fonts: HashMap<Font, SDLFont<'ttf, 'static>>,
    rendered_tiles: HashMap<i32, Texture>, 
}

impl<'ttf> Visuals<'ttf> {
    pub(crate) fn new(canvas: WindowCanvas, ttf_context: &'ttf Sdl2TtfContext) -> Self {
        let texture_creator = canvas.texture_creator();
        Visuals {
            canvas,
            texture_creator,
            ttf_context,
            textures: HashMap::new(),
            fonts: HashMap::new(),
            rendered_tiles: HashMap::new(),
        }
    }
}

impl<'ttf> Visuals<'ttf> {
    fn draw(&mut self, drawable: &dyn Drawable, camera: Camera) -> ::Result<()> {
        drawable.render(&mut MainCanvas::new(self, camera))
    }

    fn render_tile_grid(&mut self, tile_grid: &mut TileGrid) -> ::Result<Option<Texture>> {
        if let Some(tile_size) = tile_grid.tile_size() {
            let size = tile_grid.size();
            let surface = Surface::new(
                size.width * tile_size.width, 
                size.height * tile_size.height, 
                PixelFormatEnum::RGBA8888,
            )?;
            let mut canvas = SDLCanvas::from_surface(surface)?;
            let mut textures: HashMap<Image, Texture> = HashMap::default();
            self.canvas.set_draw_color(SDLColor::RGBA(0, 0, 0, 0));
            self.canvas.clear();
            for (index, tile) in tile_grid.tiles().enumerate() {
                if let Some(tile) = tile {
                    let texture = textures
                        .entry(*tile.tile_set.image())
                        .or_insert(canvas.texture_creator().load_texture(tile.tile_set.image())?);
                    let frame = tile.tile_set.cell(tile.index);
                    let point = Point::new(
                        (index as u32 % size.width * tile_size.width) as i32, 
                        (index as u32 / size.width * tile_size.height) as i32,
                    );
                    canvas.copy(
                        &texture, 
                        Some(frame.into()), 
                        Some(Rect::from(point, frame.dimen()).into()),
                    )?;
                }
            }
            Ok(Some(self.texture_creator.create_texture_from_surface(canvas.surface())?))
        } else {
            Ok(None)
        }
    }
}

impl<'a, 'ttf> System<'a> for Visuals<'ttf> {
    type SystemData = (ReadStorage<'a, Box<dyn Drawable>>, Write<'a, TileLayers>, Read<'a, Camera>);

    fn run(&mut self, (drawable, mut tile_layers, camera): Self::SystemData) {
        self.canvas.set_draw_color(Color::rgb(0, 0, 0).into());
        self.canvas.clear();
        self.canvas.set_draw_color(Color::rgb(255, 0, 0).into());
        let mut to_draw: Vec<_> = drawable.join()
            .map(|it| ToDraw::Drawable(it))
            .chain(tile_layers.iter_mut().map(|(depth, tiles)| ToDraw::TileGrid(tiles, *depth)))
            .collect();
        to_draw.sort_by_key(|it| it.depth());
        for drawable in to_draw {
            match drawable {
                ToDraw::Drawable(drawable) => {
                    if let Err(error) = self.draw(&**drawable, *camera) {
                        eprintln!("Failed to draw drawable: {:?}", error);
                    }
                }
                ToDraw::TileGrid(tile_grid, depth) => {
                    if tile_grid.dirty() {
                        match self.render_tile_grid(tile_grid) {
                            Ok(Some(texture)) => {
                                self.rendered_tiles.insert(depth, texture);
                            }
                            Ok(None) => continue,
                            Err(error) => {
                                eprintln!("Failed to render tiles: {:?}", error);
                                continue;
                            }
                        }
                    }
                    if let Some(texture) = self.rendered_tiles.get(&depth) {
                        let TextureQuery { width, height, .. } = texture.query();
                        let result = self.canvas.copy(
                            &texture, 
                            None, 
                            Some(Rect::from(tile_grid.offset(), Dimen::new(width, height)).transform(camera.input, camera.output).into())
                            );
                        if let Err(error) = result {
                            eprintln!("Failed to draw tiles: {:?}", error);
                        }
                    }
                }
            }
        }
        self.canvas.present();
    }
}

struct MainCanvas<'a, 'ttf: 'a> {
    visuals: &'a mut Visuals<'ttf>,
    color: Color,
    font: Option<Font>,
    camera: Camera,
}

impl<'a, 'ttf: 'a> MainCanvas<'a, 'ttf> {
    pub fn new(visuals: &'a mut Visuals<'ttf>, camera: Camera) -> Self {
        MainCanvas { 
            visuals, 
            color: Color::default(),
            font: None,
            camera,
        }
    }
}

impl<'a, 'ttf: 'a> Canvas for MainCanvas<'a, 'ttf> {
    fn set_color(&mut self, color: Color) {
        self.color = color;
    }

    fn set_font(&mut self, font: Font) {
        self.font = Some(font);
    }

    fn draw_rect(&mut self, rect: Rect) -> ::Result<()> {
        let rect = rect.transform(self.camera.input, self.camera.output);
        self.visuals.canvas.draw_rect(rect.into())?;
        Ok(())
    }

    fn draw_rect_filled(&mut self, rect: Rect) -> ::Result<()> {
        let rect = rect.transform(self.camera.input, self.camera.output);
        self.visuals.canvas.fill_rect(Some(rect.into()))?;
        Ok(())
    }

    fn draw_image(&mut self, point: Point, image: Image) -> ::Result<()> {
        let texture = self.visuals.textures.entry(image).or_insert(self.visuals.texture_creator.load_texture(image)?);
        let TextureQuery { width, height, .. } = texture.query();
        self.visuals.canvas.copy(&texture, None, Some(Rect::from(point, Dimen::new(width, height)).transform(self.camera.input, self.camera.output).into()))?;
        Ok(())
    }

    fn draw_sprite(&mut self, point: Point, frame: usize, sprite: Sprite) -> ::Result<()> {
        let texture = self.visuals.textures.entry(sprite.image()).or_insert(self.visuals.texture_creator.load_texture(sprite.image())?);
        let frame = sprite
            .frame(frame)
            .expect("A sprite must have some frames to be used");
        self.visuals.canvas.copy(&texture, Some((*frame).into()), Some(Rect::from(point, frame.dimen()).transform(self.camera.input, self.camera.output).into()))?;
        Ok(())
    }

    fn draw_text(&mut self, point: Point, ref text: String) -> ::Result<()> {
        if let Some(font) = self.font {
            // TODO: not the most efficient... try and optimize for static vs dynamic text
            let font = self.visuals.fonts.entry(font).or_insert(self.visuals.ttf_context.load_font(font.path(), font.size())?);
            let surface = font.render(text).blended(self.color)?;
            let texture = self.visuals.texture_creator.create_texture_from_surface(surface)?;
            let TextureQuery { width, height, .. } = texture.query();
            self.visuals.canvas.copy(&texture, None, Some(Rect::from(point, Dimen::new(width, height)).transform(self.camera.input, self.camera.output).into()))?;
        }
        Ok(())
    }

    fn measure_text(&mut self, ref text: String) -> ::Result<Dimen> {
        if let Some(font) = self.font {
            let font = self.visuals.fonts.entry(font).or_insert(self.visuals.ttf_context.load_font(font.path(), font.size())?);
            let (width, height) = font.size_of(text)?;
            Ok(Dimen::new(width, height))
        } else {
            Ok(Dimen::new(0, 0))
        }
    }
}
