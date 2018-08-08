//! A resource that defines the current visible region of the game
use crate::model::shape::{Rect, Point};

/// A resource that defines the current visible region of the game
#[derive(Copy, Clone, Eq, PartialEq, Default, Debug)]
pub struct Camera {
    /// The input (game coordinates) that this [`Camera`] is looking at.
    pub input: Rect,
    /// The output rect (window coordinates) that this [`Camera`] renders to.
    pub output: Rect,
}

impl Camera {
    /// Creates a new [`Camera`] over the specified area
    pub fn new(input: Rect, output: Rect) -> Self {
        Camera {
            input,
            output,
        }
    }

    /// Moves this [`Camera`] so its center is over a given Point.
    pub fn center_on(&mut self, center: Point) -> &mut Self {
        let point = Point::new(
            center.x - (self.input.width / 2) as i32,
            center.y - (self.input.height / 2) as i32,
        );
        self.input = Rect::from(point, self.input.dimen());
        self
    }

    /// Moves this [`Camera`] so that it's input never shows anything outside of a given [`Rect`]
    ///
    /// If the [`Rect`] is smaller than the camera, behavior will be unpredictable.
    pub fn keep_within(&mut self, rect: Rect) -> &mut Self {
        let point = Point::new(
            i32::max(rect.x, i32::min(self.input.x, rect.width as i32 - self.input.width as i32)),
            i32::max(rect.y, i32::min(self.input.y, rect.height as i32 - self.input.height as i32)),
        );
        self.input = Rect::from(point, self.input.dimen());
        self
    }
}
