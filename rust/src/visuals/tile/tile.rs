use super::TileSet;

/// A single cell of a [`TileSet`] which is to be drawn somewhere.
#[derive(Copy, Clone, Eq, PartialEq, Debug)]
pub struct Tile {
    /// The [`TileSet`] that this tile belongs to
    pub tile_set: &'static TileSet, 
    /// The index of the cell within the [`TileSet`] that this is corresponding to
    pub index: usize,
}
