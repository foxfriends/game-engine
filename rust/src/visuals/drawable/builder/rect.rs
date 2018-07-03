//! A component of the [`DrawableBuilder`] that adds a [`Rect`] with some effects applied

use model::shape::Rect;

use super::{DrawItem, DrawEffect, DrawableBuilder, BaseDrawableBuilder};
use super::Attributer;

/// Changes properties of a [`Rect`] that is part of a [`Drawable`]
pub struct RectBuilder {
    rect: Rect,
    builder: BaseDrawableBuilder,
    effects: Option<Vec<DrawEffect>>,
}

impl RectBuilder {
    /// Creates a new SpriteBuilder
    pub(crate) fn new(rect: Rect, builder: impl DrawableBuilder) -> Self {
        Self {
            rect,
            builder: builder.commit(),
            effects: None,
        }
    }
}

impl DrawableBuilder for RectBuilder {
    fn commit(mut self) -> BaseDrawableBuilder {
        self.builder.0.push((DrawItem::Rect(self.rect), self.effects));
        self.builder
    }
}

impl Attributer for RectBuilder {
    fn effects(&mut self) -> &mut Vec<DrawEffect> {
        if self.effects.is_none() {
            self.effects = Some(vec![]);
        }
        let eff = self.effects.as_mut();
        eff.unwrap()
    }
}
