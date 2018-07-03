/// A component that is added when an entity is created, and removed at the end of its first frame

use specs::storage::NullStorage;

/// A component that is added when an entity is created, and removed at the end of its first frame
#[derive(Component, Default, Debug)]
#[storage(NullStorage)]
pub struct Create;
