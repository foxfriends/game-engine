use sdl2::{
    render::TextureQuery,
    image::LoadTexture,
};

use camera::Camera;
use model::shape::*;
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
    fn size(&self) -> Dimen {
        self.visuals.size
    }

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
