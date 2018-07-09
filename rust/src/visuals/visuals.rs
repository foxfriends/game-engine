//! The actual implementation of the [`Visuals`] system
use std::collections::HashMap;

use specs::prelude::*;
use sdl2::render::{RenderTarget, Texture, TextureCreator, Canvas, TextureQuery};
use sdl2::video::{Window, WindowContext};
use sdl2::surface::Surface;
use sdl2::image::LoadTexture;
use sdl2::ttf::{Font as SDLFont, Sdl2TtfContext};

use model::shape::*;

use camera::Camera;

use super::drawable::*;
use super::image::Image;
use super::font::Font;
use super::color::Color;
use super::tile::*;

// helper type to wrap up these two other options
enum ToDraw<'a> {
    Drawable(&'a Drawable),
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

pub(crate) struct Visuals<'ttf, T: RenderTarget, C> {
    canvas: Canvas<T>,
    texture_creator: TextureCreator<C>,
    ttf_context: &'ttf Sdl2TtfContext,
    // TODO: replace this with some cache that forgets things that aren't needed anymore
    textures: HashMap<Image, Texture>,
    // TODO: replace this with some cache that forgets things that aren't needed anymore
    fonts: HashMap<Font, SDLFont<'ttf, 'static>>,
    rendered_tiles: HashMap<i32, Texture>, 
}

impl<'ttf> Visuals<'ttf, Window, WindowContext> {
    pub(crate) fn new(canvas: Canvas<Window>, ttf_context: &'ttf Sdl2TtfContext) -> Self {
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

impl<'ttf, T: RenderTarget, C> Visuals<'ttf, T, C> {
    fn draw(&mut self, drawable: &Drawable, camera: &Camera) -> ::Result<()> {
        let position = drawable.position();
        for (item, effects) in drawable.iter() {
            self.canvas.set_draw_color(Color::WHITE.into());
            let mut draw_color: Color = Color::WHITE;
            if let Some(effects) = effects {
                for effect in effects {
                    match effect {
                        &DrawEffect::Color(color) => {
                            self.canvas.set_draw_color(color.into());
                            draw_color = color;
                        },
                        _ => unimplemented!("Drawing effects are not fully implemented. Cannot do {:?}", effect),
                    }
                }
            }

            match item.translated(position) {
                DrawItem::Rect(rect) => {
                    let rect = rect.transform(camera.input, camera.output);
                    self.canvas.draw_rect(rect.into())?;
                }
                DrawItem::Point(point) => {
                    let point = Rect::from(point, Dimen::new(0, 0)).transform(camera.input, camera.output).point();
                    self.canvas.draw_point(point)?;
                }
                DrawItem::Image(image, origin) => {
                    let texture = self.textures.entry(image).or_insert(self.texture_creator.load_texture(image)?);
                    let TextureQuery { width, height, .. } = texture.query();
                    self.canvas.copy(&texture, None, Some(Rect::from(origin, Dimen::new(width, height)).transform(camera.input, camera.output).into()))?;
                }
                DrawItem::Sprite(sprite, frame, origin) => {
                    let texture = self.textures.entry(sprite.image()).or_insert(self.texture_creator.load_texture(sprite.image())?);
                    let frame = sprite
                        .frame(frame)
                        .expect("A sprite must have some frames to be used");
                    self.canvas.copy(&texture, Some((*frame).into()), Some(Rect::from(origin, frame.dimen()).transform(camera.input, camera.output).into()))?;
                }
                DrawItem::Text(font, ref text, offset, caret_pos) => {
                    // TODO: not the most efficient... try and optimize for static vs dynamic text
                    let font = self.fonts.entry(font).or_insert(self.ttf_context.load_font(font.path(), font.size())?);
                    let surface = font.render(text).blended(draw_color)?;
                    let texture = self.texture_creator.create_texture_from_surface(surface)?;
                    let TextureQuery { width, height, .. } = texture.query();
                    self.canvas.copy(&texture, None, Some(Rect::from(offset, Dimen::new(width, height)).transform(camera.input, camera.output).into()))?;
                    if let Some(caret_pos) = caret_pos {
                        let mut lines = text[..caret_pos].lines();
                        let last_line = lines.next_back().unwrap();
                        let (x, line_height) = font.size_of(last_line)?;
                        self.canvas.draw_rect(
                            Rect::new(
                                offset.x + x as i32, 
                                offset.y + line_height as i32 * lines.count() as i32, 
                                1, 
                                line_height,
                            )
                            .transform(camera.input, camera.output)
                            .into()
                        )?
                    }
                }
            };
        }
        Ok(())
    }

    fn render_tile_grid(&mut self, tile_grid: &mut TileGrid) -> ::Result<Option<Texture>> {
        if let Some(tile_size) = tile_grid.tile_size() {
            let size = tile_grid.size();
            let surface = Surface::new(
                size.width * tile_size.width, 
                size.height * tile_size.height, 
                self.texture_creator.default_pixel_format(),
            )?;
            let mut canvas = Canvas::from_surface(surface)?;
            let mut textures: HashMap<Image, Texture> = HashMap::default();
            for (index, tile) in tile_grid.tiles().enumerate() {
                if let Some(tile) = tile {
                    let texture = textures
                        .entry(*tile.tile_set.image())
                        .or_insert(canvas.texture_creator().load_texture(tile.tile_set.image())?);
                    let frame = tile.tile_set.cell(tile.index);
                    let point = Point::new(
                        (index as u32 % size.width * tile_size.width) as i32, 
                        (index as u32 / size.height * tile_size.height) as i32,
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

impl<'a, 'ttf, T: RenderTarget, C> System<'a> for Visuals<'ttf, T, C> {
    type SystemData = (ReadStorage<'a, Drawable>, Write<'a, TileLayers>, Read<'a, Camera>);

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
                    if let Err(error) = self.draw(drawable, &*camera) {
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
