//! Indicates that an entity is part of the currently active scene

use specs_derive::Component;
use specs::prelude::*;

/// Indicates that an entity is part of the currently active scene. When the scene changes, all
/// entities with this component will be destroyed.
#[derive(Component, Copy, Clone, Default)]
#[storage(NullStorage)]
pub struct SceneMember;
