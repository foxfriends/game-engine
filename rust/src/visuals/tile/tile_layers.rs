use std::collections::HashMap;

use super::TileGrid;

/// A resource that keeps track of all the layers of tiles that are currently in the game.
#[derive(Default, Debug)]
pub struct TileLayers(HashMap<i32, TileGrid>);

impl TileLayers {
    /// Sets a tile layer
    pub fn set(&mut self, layer: i32, tile_grid: TileGrid) {
        self.0.insert(layer, tile_grid);
    }

    /// Removes a tile layer
    pub fn remove(&mut self, layer: i32) {
        self.0.remove(&layer);
    }

    /// Gets a layer
    pub fn get(&self, layer: i32) -> Option<&TileGrid> {
        self.0.get(&layer)
    }

    /// Gets a layer mutably
    pub fn get_mut(&mut self, layer: i32) -> Option<&mut TileGrid> {
        self.0.get_mut(&layer)
    }

    /// Clears all the layers
    pub fn clear(&mut self) {
        self.0.clear();
    }

    pub(crate) fn iter_mut(&mut self) -> impl Iterator<Item = (&i32, &mut TileGrid)> {
        self.0.iter_mut()
    }
}
