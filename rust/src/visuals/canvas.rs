//! An interface for drawing
use sdl2::ttf::GlyphMetrics;
use crate::model::shape::*;
use super::image::Image;
use super::sprite::Sprite;
use super::font::Font;
use super::color::Color;

/// Provides an interface for drawing to the user code
pub trait Canvas {
    /// Gets the dimensions of the [`Canvas`]
    fn size(&self) -> Dimen;

    /// Sets the current drawing color. Defaults to white
    fn set_color(&mut self, color: Color);
    /// Sets the current font. A font must be set before any text will be rendered
    fn set_font(&mut self, font: Font);
    /// Sets the transformation of coordinates on this canvas
    fn set_transform(&mut self, input: Rect, output: Rect);

    /// Draws an entire image at a location
    fn draw_image(&mut self, position: Point, image: Image) -> crate::Result<()>;
    /// Draws a single frame of a sprite at a location
    fn draw_sprite(&mut self, position: Point, frame: usize, sprite: Sprite) -> crate::Result<()>;

    /// Draws a rectangle (outline)
    fn draw_rect(&mut self, rect: Rect) -> crate::Result<()>;
    /// Draws a rectangle (filled)
    fn draw_rect_filled(&mut self, rect: Rect) -> crate::Result<()>;

    /// Draws some text at a location. Requires that a font was set before calling this method.
    fn draw_text(&mut self, position: Point, text: String) -> crate::Result<()>;
    /// Checks what the size of a string will be when rendered using the current font.
    fn measure_text(&mut self, text: String) -> crate::Result<Dimen>;
    /// Gets the recommended line spacing of the current font
    fn line_spacing(&mut self) -> crate::Result<i32>;
    /// Gets the glyph metrics of the current font
    fn glyph_metrics(&mut self, ch: char) -> crate::Result<Option<GlyphMetrics>>;
    /// Gets the maximum ascent of the current font
    fn font_ascent(&mut self) -> crate::Result<i32>;
    /// Gets the maximum descent of the current font
    fn font_descent(&mut self) -> crate::Result<i32>;
}
