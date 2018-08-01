use sdl2::{
    render::TextureQuery,
    image::LoadTexture,
    ttf::GlyphMetrics,
};

use crate::camera::Camera;
use crate::model::shape::*;
use super::{
    super::{
        canvas::Canvas,
        font::Font,
        image::Image,
        color::Color,
        sprite::Sprite,
    },
    Visuals,
};

pub(super) struct MainCanvas<'a, 'ttf: 'a> {
    visuals: &'a mut Visuals<'ttf>,
    color: Color,
    font: Option<Font>,
    camera: Camera,
}

impl<'a, 'ttf: 'a> MainCanvas<'a, 'ttf> {
    pub(super) fn new(visuals: &'a mut Visuals<'ttf>, camera: Camera) -> Self {
        visuals.canvas.set_draw_color(Color::default().into());
        MainCanvas {
            visuals,
            color: Color::default(),
            font: None,
            camera,
        }
    }
}

impl<'a, 'ttf: 'a> Canvas for MainCanvas<'a, 'ttf> {
    fn size(&self) -> Dimen {
        self.visuals.size
    }

    fn set_color(&mut self, color: Color) {
        self.color = color;
        self.visuals.canvas.set_draw_color(color.into());
    }

    fn set_font(&mut self, font: Font) {
        self.font = Some(font);
    }

    fn set_transform(&mut self, input: Rect, output: Rect) {
        self.camera = Camera::new(input, output);
    }

    fn draw_rect(&mut self, rect: Rect) -> crate::Result<()> {
        let rect = rect.transform(self.camera.input, self.camera.output);
        self.visuals.canvas.draw_rect(rect.into())?;
        Ok(())
    }

    fn draw_rect_filled(&mut self, rect: Rect) -> crate::Result<()> {
        let rect = rect.transform(self.camera.input, self.camera.output);
        self.visuals.canvas.fill_rect(Some(rect.into()))?;
        Ok(())
    }

    fn draw_image(&mut self, point: Point, image: Image) -> crate::Result<()> {
        let texture_creator = &mut self.visuals.texture_creator;
        let texture = self.visuals.textures.entry(image.path_buf()).or_insert_with(|| texture_creator.load_texture(image));
        match texture {
            Ok(texture) => {
                let TextureQuery { width, height, .. } = texture.query();
                self.visuals.canvas.copy(&texture, None, Some(Rect::from(point, Dimen::new(width, height)).transform(self.camera.input, self.camera.output).into()))?;
                Ok(())
            }
            Err(error) => Err(error.clone().into()),
        }
    }

    fn draw_sprite(&mut self, point: Point, frame: usize, sprite: Sprite) -> crate::Result<()> {
        let texture_creator = &mut self.visuals.texture_creator;
        let texture = self.visuals.textures.entry(sprite.image().path_buf()).or_insert_with(|| texture_creator.load_texture(sprite.image()));
        match texture {
            Ok(texture) => {
                let frame = sprite
                    .frame(frame)
                    .expect("A sprite must have some frames to be used");
                self.visuals.canvas.copy(&texture, Some((*frame).into()), Some(Rect::from(point, frame.dimen()).transform(self.camera.input, self.camera.output).into()))?;
                Ok(())
            }
            Err(error) => Err(error.clone().into()),
        }
    }

    fn draw_text(&mut self, point: Point, ref text: String) -> crate::Result<()> {
        if let Some(font) = self.font {
            // TODO: not the most efficient... try and optimize for static vs dynamic text
            let ttf_context = self.visuals.ttf_context;
            let font = self.visuals.fonts.entry(font).or_insert_with(|| ttf_context.load_font(font.path(), font.size()));
            match font {
                Ok(font) => {
                    let surface = font.render(text).blended(self.color)?;
                    let texture = self.visuals.texture_creator.create_texture_from_surface(surface)?;
                    let TextureQuery { width, height, .. } = texture.query();
                    self.visuals.canvas.copy(&texture, None, Some(Rect::from(point, Dimen::new(width, height)).transform(self.camera.input, self.camera.output).into()))?;
                    Ok(())
                }
                Err(error) => Err(error.clone().into())
            }
        } else {
            Ok(())
        }
    }

    fn measure_text(&mut self, ref text: String) -> crate::Result<Dimen> {
        if let Some(font) = self.font {
            let ttf_context = self.visuals.ttf_context;
            let font = self.visuals.fonts.entry(font).or_insert_with(|| ttf_context.load_font(font.path(), font.size()));
            match font {
                Ok(font) => {
                    let (width, height) = font.size_of(text)?;
                    Ok(Dimen::new(width, height))
                }
                Err(error) => Err(error.clone().into()),
            }
        } else {
            Ok(Dimen::new(0, 0))
        }
    }

    fn line_spacing(&mut self) -> crate::Result<i32> {
        if let Some(font) = self.font {
            let ttf_context = self.visuals.ttf_context;
            match self.visuals.fonts.entry(font).or_insert_with(|| ttf_context.load_font(font.path(), font.size())) {
                Ok(font) => Ok(font.recommended_line_spacing()),
                Err(error) => Err(error.clone().into()),
            }
        } else {
            Ok(0)
        }
    }

    fn glyph_metrics(&mut self, ch: char) -> crate::Result<Option<GlyphMetrics>> {
        if let Some(font) = self.font {
            let ttf_context = self.visuals.ttf_context;
            match self.visuals.fonts.entry(font).or_insert_with(|| ttf_context.load_font(font.path(), font.size())) {
                Ok(font) => Ok(font.find_glyph_metrics(ch)),
                Err(error) => Err(error.clone().into()),
            }
        } else {
            Ok(None)
        }
    }

    fn font_ascent(&mut self) -> crate::Result<i32> {
        if let Some(font) = self.font {
            let ttf_context = self.visuals.ttf_context;
            match self.visuals.fonts.entry(font).or_insert_with(|| ttf_context.load_font(font.path(), font.size())) {
                Ok(font) => Ok(font.ascent()),
                Err(error) => Err(error.clone().into()),
            }
        } else {
            Ok(0)
        }
    }

    fn font_descent(&mut self) -> crate::Result<i32> {
        if let Some(font) = self.font {
            let ttf_context = self.visuals.ttf_context;
            match self.visuals.fonts.entry(font).or_insert_with(|| ttf_context.load_font(font.path(), font.size())) {
                Ok(font) => Ok(font.descent()),
                Err(error) => Err(error.clone().into()),
            }
        } else {
            Ok(0)
        }
    }
}
