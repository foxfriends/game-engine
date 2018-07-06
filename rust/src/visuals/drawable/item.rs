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

impl DrawItem {
    /// Changes the offset of the Drawable by some amount
    pub fn translated<I: Into<Point>>(&self, position: I) -> DrawItem {
        let pos = position.into();
        match self {
            &DrawItem::Image(image, point) => DrawItem::Image(image, pos - point),
            &DrawItem::Sprite(ref sprite, frame, point) => DrawItem::Sprite(sprite.clone(), frame, pos - point),
            &DrawItem::Text(font, ref text, point, caret_pos) => DrawItem::Text(font, text.clone(), point + pos, caret_pos),
            &DrawItem::Rect(rect) => DrawItem::Rect(rect.translate(pos)),
            &DrawItem::Point(point) => DrawItem::Point(point + pos),
        }
    }
}

