//! A trait that allows effects to be added to a component of a [`Drawable`]

use super::super::super::color::Color;
use super::super::effect::DrawEffect;

/// A trait that allows effects to be added to a component of a [`Drawable`]
pub trait Attributer: Sized {
    #[doc(hidden)]
    fn effects(&mut self) -> &mut Vec<DrawEffect>;

    /// Sets the blend color of this component. The default color is white.
    fn color(mut self, color: Color) -> Self {
        self.effects().push(DrawEffect::Color(color));
        self
    }

    /// Sets the alpha of this component. The default alpha is opaque.
    fn alpha(mut self, alpha: f32) -> Self {
        self.effects().push(DrawEffect::Alpha(alpha));
        self
    }
}
