//! Stores information about sprite sheets

use crate::model::shape::Rect;
use super::image::Image;

/// An image, which is broken up into subimages. Built in such a way that they can be defined
/// statically
#[derive(Copy, Clone, PartialEq, Eq, Debug)]
pub struct Sprite {
    image: Image,
    frames: &'static [Rect],
}

impl Sprite {
    /// Creates a new `Sprite` from an [`Image`]
    pub const fn new(image: Image, frames: &'static [Rect]) -> Self {
        Sprite {
            image,
            frames,
        }
    }

    /// Gets the image that this sprite is for
    pub fn image(&self) -> Image {
        self.image
    }

    /// Gets the subsection of the image to draw for a given frame number
    pub fn frame(&self, frame: usize) -> Option<&Rect> {
        self.frames.iter().nth(frame).into()
    }
}
