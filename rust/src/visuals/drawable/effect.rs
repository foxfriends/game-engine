//! Describes some effect that is to be applied to something that is being drawn

use super::super::color::Color;

/// An effect to be applied to the thing being drawn
#[derive(PartialEq, Copy, Clone, Debug)]
pub enum DrawEffect {
    /// Sets the color for drawing. This color is blended into a sprite or image, and is used as a
    /// flat color for drawing shapes and text
    Color(Color),
    /// Sets the alpha for drawing. This is applied after the color blend
    Alpha(f32),
    /// Sets the blend mode for drawing
    Blend(), // TODO: blend modes
}
