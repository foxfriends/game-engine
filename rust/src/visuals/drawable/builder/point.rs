//! A component of the [`DrawableBuilder`] that adds a [`Point`] with some effects applied

use model::shape::Point;

use super::{DrawItem, DrawEffect, DrawableBuilder, BaseDrawableBuilder};
use super::Attributer;

/// Changes properties of a [`Point`] that is part of a [`Drawable`]
pub struct PointBuilder {
    point: Point,
    builder: BaseDrawableBuilder,
    effects: Option<Vec<DrawEffect>>,
}

impl PointBuilder {
    /// Creates a new SpriteBuilder
    pub(crate) fn new(point: Point, builder: impl DrawableBuilder) -> Self {
        Self {
            point,
            builder: builder.commit(),
            effects: None,
        }
    }
}

impl DrawableBuilder for PointBuilder {
    fn commit(mut self) -> BaseDrawableBuilder {
        self.builder.0.push((DrawItem::Point(self.point), self.effects));
        self.builder
    }
}

impl Attributer for PointBuilder {
    fn effects(&mut self) -> &mut Vec<DrawEffect> {
        if self.effects.is_none() {
            self.effects = Some(vec![]);
        }
        let eff = self.effects.as_mut();
        eff.unwrap()
    }
}
