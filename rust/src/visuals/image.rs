//! Manages images

use std::path::Path;

/// An image handle
#[derive(Copy, Clone, Eq, PartialEq, Hash, Debug)]
pub struct Image(&'static str);

impl Image {
    /// Creates a new image
    pub const fn new(path: &'static str) -> Self {
        Image(path)
    }
}

impl AsRef<Path> for Image {
    fn as_ref(&self) -> &Path {
        Path::new(self.0)
    }
}
