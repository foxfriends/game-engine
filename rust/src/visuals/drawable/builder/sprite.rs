//! A component of the [`DrawableBuilder`] that adds a [`Sprite`] with some effects applied

use model::shape::Point;

use super::super::super::sprite::Sprite;
use super::{DrawItem, DrawEffect, BaseDrawableBuilder, DrawableBuilder};
use super::Attributer;

/// Changes properties of a [`Sprite`] that is part of a [`Drawable`]
pub struct SpriteBuilder {
    sprite: Sprite,
    origin: Point,
    frame: usize,
    builder: BaseDrawableBuilder,
    effects: Option<Vec<DrawEffect>>,
}

impl SpriteBuilder {
    /// Creates a new SpriteBuilder
    pub(crate) fn new(sprite: Sprite, builder: impl DrawableBuilder) -> Self {
        Self {
            sprite,
            origin: Point::default(),
            frame: 0,
            builder: builder.commit(),
            effects: None,
        }
    }

    /// Sets the frame that is to be displayed. Defaults to 0.
    pub fn frame(self, frame: usize) -> Self {
        Self {
            frame,
            ..self
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

impl DrawableBuilder for SpriteBuilder {
    fn commit(mut self) -> BaseDrawableBuilder {
        self.builder.0.push((DrawItem::Sprite(self.sprite, self.frame, self.origin), self.effects));
        self.builder
    }
}

impl Attributer for SpriteBuilder {
    fn effects(&mut self) -> &mut Vec<DrawEffect> {
        if self.effects.is_none() {
            self.effects = Some(vec![]);
        }
        let eff = self.effects.as_mut();
        eff.unwrap()
    }
}
