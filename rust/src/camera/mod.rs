//! A resource that defines the current visible region of the game
use model::shape::{Rect, Point};

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
    pub fn center_on(&mut self, center: Point) {
        let point = Point::new(
            center.x - (self.input.width / 2) as i32,
            center.y - (self.input.height / 2) as i32,
        );
        self.input = Rect::from(point, self.input.dimen());
    }
}
