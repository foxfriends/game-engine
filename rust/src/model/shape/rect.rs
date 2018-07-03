//! Rectangles

use sdl2::rect as sdl;
use super::{Point, Dimen};

/// A rectangle
#[derive(Copy, Clone, PartialEq, Eq, Serialize, Deserialize, Debug, Default)]
pub struct Rect {
    /// The x position (left edge)
    pub x: i32,
    /// The y position (top edge)
    pub y: i32,
    /// The width
    pub width: u32,
    /// The height
    pub height: u32,
}

impl Rect {
    /// Creates a new `Rect`
    pub const fn new(x: i32, y: i32, width: u32, height: u32) -> Self {
        Self { x, y, width, height }
    }

    /// Creates a new `Rect` based on a [`Point`] and [`Dimen`]
    pub fn from(Point { x, y }: Point, Dimen { width, height }: Dimen) -> Self {
        Self::new(x, y, width, height)
    }

    /// The x and y components, as a [`Point`]
    pub fn point(&self) -> Point {
        Point::new(self.x, self.y)
    }

    /// The width and height components, as a [`Dimen`]
    pub fn dimen(&self) -> Dimen {
        Dimen::new(self.width, self.height)
    }

    /// Moves the x and y components of this rectangle
    pub fn translate(&self, distance: Point) -> Self {
        Self {
            x: self.x + distance.x,
            y: self.y + distance.y,
            ..*self
        }
    }

    /// Checks if a point is contained within this rectangle
    pub fn contains(&self, &Point { x, y }: &Point) -> bool {
        x >= self.x && x < self.x + self.width as i32 && y >= self.y && y < self.y + self.height as i32
    }

    /// Determines whether two rectangles overlap
    pub fn overlaps(&self, other: &Rect) -> bool {
        (i32::abs(self.x - other.x) as u32) < (self.width + other.width) / 2 &&
        (i32::abs(self.y - other.y) as u32) < (self.height + other.height) / 2
    }
}

impl Into<sdl::Rect> for Rect {
    fn into(self) -> sdl::Rect {
        sdl::Rect::new(self.x, self.y, self.width, self.height)
    }
}
