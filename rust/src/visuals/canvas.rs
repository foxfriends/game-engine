//! An interface for drawing
use model::shape::*;
use super::image::Image;
use super::sprite::Sprite;
use super::font::Font;
use super::color::Color;

/// Provides an interface for drawing to the user code
pub trait Canvas {
    /// Sets the current drawing color. Defaults to white
    fn set_color(&mut self, Color);
    /// Sets the current font. A font must be set before any text will be rendered
    fn set_font(&mut self, Font);

    /// Draws an entire image at a location
    fn draw_image(&mut self, Point, Image) -> ::Result<()>;
    /// Draws a single frame of a sprite at a location
    fn draw_sprite(&mut self, Point, usize, Sprite) -> ::Result<()>;
    /// Draws a rectangle (outline)
    fn draw_rect(&mut self, Rect) -> ::Result<()>;
    /// Draws a rectangle (filled)
    fn draw_rect_filled(&mut self, Rect) -> ::Result<()>;
    /// Draws some text at a location. Requires that a font was set before calling this method.
    fn draw_text(&mut self, Point, String) -> ::Result<()>;
    /// Checks what the size of a string will be when rendered using the current font.
    fn measure_text(&mut self, String) -> ::Result<Dimen>;
}
