//! Defines a trait that describes how to render an [`Entity`]
use std::any::Any;
use specs::prelude::*;
use super::canvas::Canvas;

/// Describes how an [`Entity`] should be drawn. Use boxed as a component
pub trait Drawable: Any + Sync + Send {
    /// The depth at which to draw this [`Drawable`]
    fn depth(&self) -> i32;

    /// Actually draw this [`Drawable`] to the [`Canvas`]
    fn render(&self, canvas: &mut dyn Canvas) -> crate::Result<()>;

    /// Gets this [`Drawable`] as an [`Any`]
    fn as_any(&self) -> &dyn Any;

    /// Gets this [`Drawable`] as a mutable [`Any`]
    fn as_any_mut(&mut self) -> &mut dyn Any;
}

impl Component for Box<dyn Drawable> {
    type Storage = VecStorage<Box<dyn Drawable>>;
}
