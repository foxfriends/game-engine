//! Describes a single visible element, such as an image or a shape, which is to be drawn at some
//! location

use model::shape::{Rect, Point};

use super::super::image::Image;
use super::super::sprite::Sprite;
use super::super::font::Font;

/// Something that can be drawn
#[derive(Clone, Debug)]
pub enum DrawItem {
    /// An [`Image`](image::Image), at some origin
    Image(Image, Point),
    /// A [`Sprite`](sprite::Sprite), at some origin
    Sprite(Sprite, usize, Point),
    /// Some text
    Text(Font, String, Point, Option<usize>),
    /// A rectangle
    Rect(Rect),
    /// A single pixel
    Point(Point),
}
