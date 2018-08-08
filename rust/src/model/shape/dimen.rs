//! Dimensions
use serde_derive::{Serialize, Deserialize};

/// A dimension
#[derive(Copy, Clone, PartialEq, Eq, Debug, Serialize, Deserialize, Default)]
pub struct Dimen {
    /// The width
    pub width: u32,
    /// The height
    pub height: u32,
}

impl Dimen {
    /// Creates a new dimension
    pub const fn new(width: u32, height: u32) -> Self {
        Self { width, height }
    }

    /// Extends both dimensions of the [`Dimen`] by adding another
    pub fn extend(self, other: Dimen) -> Dimen {
        Self {
            width: self.width + other.width,
            height: self.height + other.height,
        }
    }
}
