//! Builds a drawable

use model::shape::{Point, Rect};

mod sprite;
mod image;
mod attributer;
mod rect;
mod point;
mod text;

pub use self::attributer::Attributer;
pub use self::sprite::SpriteBuilder;
pub use self::image::ImageBuilder;
pub use self::rect::RectBuilder;
pub use self::point::PointBuilder;
pub use self::text::TextBuilder;

use super::item::DrawItem;
use super::effect::DrawEffect;
use super::Drawable;
use super::super::sprite::Sprite;
use super::super::image::Image;
use super::super::font::Font;

/// The most simple [`DrawableBuilder`]
pub struct BaseDrawableBuilder(Vec<(DrawItem, Option<Vec<DrawEffect>>)>);

impl DrawableBuilder for BaseDrawableBuilder {
    fn commit(self) -> BaseDrawableBuilder { self }
}

impl BaseDrawableBuilder {
    pub(crate) fn new() -> Self {
        BaseDrawableBuilder(vec![])
    }
}

/// Trait for buliding a complex drawable
pub trait DrawableBuilder: Sized {
    /// Commits this component of the drawable to the main builder
    fn commit(self) -> BaseDrawableBuilder;

    /// Completes building this drawable
    fn build(self) -> Drawable {
        Drawable {
            position: Point::default(),
            items: self.commit().0,
        }
    }

    /// Adds a sprite to the drawable
    fn sprite(self, sprite: Sprite) -> SpriteBuilder {
        SpriteBuilder::new(sprite, self)
    }

    /// Adds an image to the drawable
    fn image(self, image: Image) -> ImageBuilder {
        ImageBuilder::new(image, self)
    }

    /// Adds a rectangle to the drawable
    fn rect(self, rect: Rect) -> RectBuilder {
        RectBuilder::new(rect, self)
    }

    /// Adds a point to the drawable
    fn point(self, point: Point) -> PointBuilder {
        PointBuilder::new(point, self)
    }

    /// Adds some text to the drawable
    fn text(self, font: Font, text: String) -> TextBuilder {
        TextBuilder::new(font, text, self)
    }
}
