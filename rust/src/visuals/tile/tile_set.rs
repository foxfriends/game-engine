use super::{
    super::image::Image,
    Tile,
};
use model::shape::*;

/// A [`TileSet`] defines a grid of tiles which are optimized for being drawn statically at runtime.
#[derive(Copy, Clone, Eq, PartialEq, Debug)]
pub struct TileSet {
    image: &'static Image,
    count: usize,
    per_row: usize,
    size: Dimen,
    origin: Point,
    spacing: Dimen,
}

impl TileSet {
    /// Creates a new [`TileSet`] from all the required information.
    pub const fn new(image: &'static Image, count: usize, per_row: usize, size: Dimen, origin: Point, spacing: Dimen) -> TileSet {
        Self {
            image,
            count,
            per_row,
            size,
            origin,
            spacing,
        }
    }

    /// The image associated with this [`TileSet`]
    pub fn image(&self) -> &'static Image {
        self.image
    }

    /// Gets the bounds of a particular tile at a given index.
    pub fn cell(&self, index: usize) -> Rect {
        assert!(index < self.count, "Index: {}, self: {:?}", index, self);
        let (i, j) = (index % self.per_row, index / self.per_row);
        let point = Point { 
            x: self.origin.x + ((self.size.width + self.spacing.width) * i as u32) as i32,
            y: self.origin.y + ((self.size.height + self.spacing.height) * j as u32) as i32,
        };
        Rect::from(point, self.size)
    }

    /// Creates a new tile corresponding to the cell with the provided index in this TileSet
    pub fn tile(&'static self, index: usize) -> Tile {
        assert!(index < self.count);
        Tile {
            tile_set: self,
            index,
        }
    }

    /// The size of a tile in this TileSet
    pub fn cell_size(&self) -> Dimen {
        self.size
    }
}

