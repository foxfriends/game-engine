//! Dimensions

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
}
