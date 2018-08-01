//! A component that is added when an entity is going to be deleted. The entity will be deleted at
//! the end of the current frame

use specs_derive::Component;
use specs::storage::NullStorage;

/// A component that is added when an entity is going to be deleted. The entity will be deleted at
/// the end of the current frame
#[derive(Component, Default, Debug)]
#[storage(NullStorage)]
pub struct Delete;
