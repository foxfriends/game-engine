//! Manages fonts

use std::path::Path;

/// A font handle
#[derive(Copy, Clone, Eq, PartialEq, Hash, Debug)]
pub struct Font(&'static str, u16);

impl Font {
    /// Creates a new font
    pub const fn new(path: &'static str, size: u16) -> Self {
        Font(path, size)
    }

    /// The path to this font
    pub(crate) fn path(&self) -> &'static str {
        self.0
    }

    /// The point size of this font
    pub(crate) fn size(&self) -> u16 {
        self.1
    }
}

impl AsRef<Path> for Font {
    fn as_ref(&self) -> &Path {
        Path::new(self.0)
    }
}
