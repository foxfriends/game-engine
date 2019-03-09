//! Resources that track the mouse state

use serde::{Serialize, Deserialize};
use crate::model::shape::Point;

/// Resource that reflects the current state of the mouse
#[derive(Copy, Clone, PartialEq, Eq, Debug, Default)]
pub struct MouseState {
    pub(crate) left: bool,
    pub(crate) right: bool,
    pub(crate) middle: bool,
    pub(crate) x: i32,
    pub(crate) y: i32,
}

/// The buttons of the mouse
#[derive(Copy, Clone, PartialEq, Eq, Serialize, Deserialize, Debug)]
#[allow(missing_docs)]
pub enum MouseButton {
    Left,
    Middle,
    Right,
}

/// A change in the state of the mouse
///
/// TODO: this requires some sort of "click" event, where the press and release happened on the
///       same point.
///
/// TODO: also a "double-click" would be nice, where two full "click" events fired within some time
///       interval
#[derive(Copy, Clone, PartialEq, Eq, Debug)]
pub enum MouseEvent {
    /// A mouse button has been released
    Release(MouseButton, Point),
    /// A mouse button has been pressed
    Press(MouseButton, Point),
    /// The mouse has moved by some amount.
    Move {
        /// The distance the mouse moved
        offset: Point,
        /// The final position of the mouse
        position: Point,
    },
}

/// Resource that tracks changes in the mouse state
#[derive(Debug, Default)]
pub struct MouseEvents(Vec<MouseEvent>);

impl MouseEvents {
    pub(crate) fn clear(&mut self) {
        self.0.clear();
    }

    pub(crate) fn add(&mut self, event: MouseEvent) {
        self.0.push(event);
    }

    /// An iterator over all of the [`MouseEvents`]s
    pub fn iter<'a>(&'a self) -> impl Iterator<Item = MouseEvent> + 'a {
        self.0.iter().cloned()
    }
}

impl MouseState {
    /// Whether the left button is currently pressed
    pub fn left_pressed(&self) -> bool {
        self.left
    }

    /// Whether the right button is currently pressed
    pub fn right_pressed(&self) -> bool {
        self.right
    }

    /// Whether the middle button is currently pressed
    pub fn middle_pressed(&self) -> bool {
        self.middle
    }

    /// The corrent position of the cursor
    pub fn position(&self) -> Point {
        Point::new(self.x, self.y)
    }
}
