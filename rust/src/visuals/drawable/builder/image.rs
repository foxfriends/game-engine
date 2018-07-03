//! A component of the [`DrawableBuilder`] that adds an [`Image`] with some effects applied

use model::shape::Point;

use super::super::super::image::Image;
use super::{DrawItem, DrawEffect, DrawableBuilder, BaseDrawableBuilder};
use super::Attributer;

/// Changes properties of an [`Image`] that is part of a [`Drawable`]
pub struct ImageBuilder {
    image: Image,
    origin: Point,
    builder: BaseDrawableBuilder,
    effects: Option<Vec<DrawEffect>>,
}

impl ImageBuilder {
    /// Creates a new SpriteBuilder
    pub(crate) fn new(image: Image, builder: impl DrawableBuilder) -> Self {
        Self {
            image,
            origin: Point::default(),
            builder: builder.commit(),
            effects: None,
        }
    }

    /// Sets the origin of this image
    pub fn origin(self, origin: Point) -> Self {
        Self {
            origin,
            ..self
        }
    }
}

impl DrawableBuilder for ImageBuilder {
    fn commit(mut self) -> BaseDrawableBuilder {
        self.builder.0.push((DrawItem::Image(self.image, self.origin), self.effects));
        self.builder
    }
}

impl Attributer for ImageBuilder {
    fn effects(&mut self) -> &mut Vec<DrawEffect> {
        if self.effects.is_none() {
            self.effects = Some(vec![]);
        }
        let eff = self.effects.as_mut();
        eff.unwrap()
    }
}
