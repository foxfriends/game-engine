use model::shape::{Point, Dimen};
use super::Tile;

/// Defines an arrangement of [`Tile`]s
#[derive(Clone, Debug)]
pub struct TileGrid {
    dirty: bool,
    offset: Point,
    size: Dimen,
    grid: Vec<Option<Tile>>,
}

impl TileGrid {
    /// Creates a new [`TileGrid`].
    /// 
    /// # Panics
    /// If the grid does not contain the expected number of tiles, or if not all the tiles are the
    /// same size.
    pub fn new(offset: Point, size: Dimen, grid: Vec<Option<Tile>>) -> Self {
        assert_eq!(size.width as usize * size.height as usize, grid.len());
        if let Some(Some(first_cell)) = grid.iter().find(|cell| cell.is_some()) {
            let cell_size = first_cell.tile_set.cell_size();
            assert!(grid.iter().all(|cell| cell.map(|cell| cell.tile_set.cell_size() == cell_size).unwrap_or(true)));
        }
        Self {
            dirty: true,
            offset,
            size,
            grid,
        }
    }

    /// Changes a tile in this [`TileGrid`]
    pub fn alter_tile(&mut self, index: usize, tile: Option<Tile>) {
        if let Some(tile) = tile {
            if let Some(size) = self.tile_size() {
                assert_eq!(tile.tile_set.cell_size(), size);
            }
        }
        if self.grid[index] != tile {
            self.dirty = true;
            self.grid[index] = tile;
        }
    }

    /// Whether this [`TileGrid`] has been changed since it was last rendered
    pub(crate) fn dirty(&self) -> bool {
        self.dirty
    }

    /// The number of tiles horizontally and vertically this [`TileGrid`] contains
    pub fn size(&self) -> Dimen {
        self.size
    }

    /// The top-left coordinate of this [`TileGrid`]
    pub fn offset(&self) -> Point {
        self.offset
    }

    /// Retrieves all the tiles from this [`TileGrid`], marking it as clean now that someone has
    /// observed it.
    pub(crate) fn tiles(&mut self) -> impl Iterator<Item = &Option<Tile>> {
        self.dirty = false;
        self.grid.iter()
    }

    /// The size of the tiles in this [`TileGrid`]. Only returns `None` if there are no tiles.
    pub fn tile_size(&self) -> Option<Dimen> {
        if let Some(Some(first_cell)) = self.grid.iter().find(|cell| cell.is_some()) {
            Some(first_cell.tile_set.cell_size())
        } else {
            None
        }
    }
}
