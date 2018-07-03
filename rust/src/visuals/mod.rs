//! Handles rendering

use std::collections::HashMap;

use specs::prelude::*;
use sdl2::render::{RenderTarget, Texture, TextureCreator, Canvas, TextureQuery};
use sdl2::video::{Window, WindowContext};
use sdl2::image::LoadTexture;
use sdl2::ttf::{Font as SDLFont, Sdl2TtfContext};

use model::shape::{Dimen, Rect};

pub mod image;
pub mod font;
pub mod color;
pub mod sprite;
pub mod drawable;

pub use self::drawable::*;
pub use self::image::Image;
pub use self::sprite::Sprite;
pub use self::font::Font;
pub use self::color::Color;

pub(crate) struct Visuals<'ttf, T: RenderTarget, C> {
    canvas: Canvas<T>,
    texture_creator: TextureCreator<C>,
    ttf_context: &'ttf Sdl2TtfContext,
    // TODO: replace this with some cache that forgets things that aren't needed anymore
    textures: HashMap<Image, Texture>,
    // TODO: replace this with some cache that forgets things that aren't needed anymore
    fonts: HashMap<Font, SDLFont<'ttf, 'static>>,
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
        }
    }
}

impl<'ttf, T: RenderTarget, C> Visuals<'ttf, T, C> {
    fn draw(&mut self, drawable: &Drawable) -> ::Result<()> {
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

            match item.clone() {
                DrawItem::Rect(rect) => self.canvas.draw_rect(rect.into())?,
                DrawItem::Point(point) => self.canvas.draw_point(point)?,
                DrawItem::Image(image, origin) => {
                    let texture = self.textures.entry(image).or_insert(self.texture_creator.load_texture(image)?);
                    let TextureQuery { width, height, .. } = texture.query();
                    self.canvas.copy(&texture, None, Some(Rect::from(origin, Dimen::new(width, height)).into()))?;
                }
                DrawItem::Sprite(sprite, frame, origin) => {
                    let texture = self.textures.entry(sprite.image()).or_insert(self.texture_creator.load_texture(sprite.image())?);
                    let frame = sprite
                        .frame(frame)
                        .expect("A sprite must have some frames to be used");
                    self.canvas.copy(&texture, Some((*frame).into()), Some(Rect::from(origin, frame.dimen()).into()))?;
                }
                DrawItem::Text(font, ref text, offset, caret_pos) => {
                    // TODO: not the most efficient... try and optimize for static vs dynamic text
                    let font = self.fonts.entry(font).or_insert(self.ttf_context.load_font(font.path(), font.size())?);
                    let surface = font.render(text).blended(draw_color)?;
                    let texture = self.texture_creator.create_texture_from_surface(surface)?;
                    let TextureQuery { width, height, .. } = texture.query();
                    self.canvas.copy(&texture, None, Some(Rect::from(offset, Dimen::new(width, height)).into()))?;
                    if let Some(caret_pos) = caret_pos {
                        let mut lines = text[..caret_pos].lines();
                        let last_line = lines.next_back().unwrap();
                        let (x, line_height) = font.size_of(last_line)?;
                        self.canvas.draw_rect(Rect::new(offset.x + x as i32, offset.y + line_height as i32 * lines.count() as i32, 1, line_height).into())?
                    }
                }
            };
        }
        Ok(())
    }
}

impl<'a, 'ttf, T: RenderTarget, C> System<'a> for Visuals<'ttf, T, C> {
    type SystemData = ReadStorage<'a, Drawable>;

    fn run(&mut self, drawable: Self::SystemData) {
        self.canvas.set_draw_color(Color::rgb(0, 0, 0).into());
        self.canvas.clear();
        self.canvas.set_draw_color(Color::rgb(255, 0, 0).into());
        for drawable in drawable.join() {
            if let Err(error) = self.draw(drawable) {
                println!("Failed to draw: {:?}", error);
            }
        }
        self.canvas.present();
    }
}
