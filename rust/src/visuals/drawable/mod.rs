//! Representations of things to be drawn

use specs::prelude::*;

mod builder;
mod item;
mod effect;

use model::shape::Point;
pub use self::builder::*;

pub(crate) use self::item::DrawItem;
pub(crate) use self::effect::DrawEffect;

/// Describes how to draw something, in its most bare form.
#[derive(Component, Clone, Default, Debug)]
#[storage(VecStorage)]
pub struct Drawable {
    position: Point,
    depth: i32,
    items: Vec<(DrawItem, Option<Vec<DrawEffect>>)>
}

impl Drawable {
    /// Starts building a new drawable
    pub fn new() -> BaseDrawableBuilder {
        BaseDrawableBuilder::new()
    }

    pub(crate) fn iter(&self) -> impl Iterator<Item = &(DrawItem, Option<Vec<DrawEffect>>)> {
        self.items.iter()
    }


    /// The position to draw this [`Drawable`] relative to
    pub fn position(&self) -> Point {
        self.position
    }

    /// Sets the position to draw this [`Drawable`] relative to
    pub fn set_position<I: Into<Point>>(&mut self, position: I) {
        self.position = position.into();
    }

    /// The depth at which to draw this [`Drawable`], relative to others
    pub fn depth(&self) -> i32 {
        self.depth
    }

    /// Sets the depth at which to draw this [`Drawable`], relative to others. A smaller depth is
    /// drawn behind higher depths
    pub fn set_depth(&mut self, depth: i32) {
        self.depth = depth;
    }
}
