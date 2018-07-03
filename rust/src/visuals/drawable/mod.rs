//! Representations of things to be drawn

use specs::prelude::*;

mod builder;
mod item;
mod effect;

pub use self::builder::*;

pub(crate) use self::item::DrawItem;
pub(crate) use self::effect::DrawEffect;

/// Describes how to draw something, in its most bare form.
#[derive(Component, Clone, Default, Debug)]
#[storage(VecStorage)]
pub struct Drawable(Vec<(DrawItem, Option<Vec<DrawEffect>>)>);

impl Drawable {
    /// Starts building a new drawable
    pub fn new() -> BaseDrawableBuilder {
        BaseDrawableBuilder::new()
    }

    pub(crate) fn iter(&self) -> impl Iterator<Item = &(DrawItem, Option<Vec<DrawEffect>>)> {
        self.0.iter()
    }
}
