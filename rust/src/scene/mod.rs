//! Handles scenes, which automatically create entities when they are started, and clean up
//! entities when they end.

use shred::{Fetch, FetchMut};
use specs::prelude::*;
use shred_derive::SystemData;

use crate::common::{SceneMember, Delete};
use crate::util::entity_factory::EntityFactory;

/// A resource that tracks the current scene (if any). Internal use only.
pub struct CurrentScene(&'static dyn Scene, Option<&'static dyn Scene>);

impl ::std::default::Default for CurrentScene {
    fn default() -> Self {
        // NOTE: This is just here because of a rust compiler bug.
        //       Once that is resolved, the actual issues with this can be addressed
        panic!();
    }
}

impl CurrentScene {
    pub(crate) fn starting_with(scene: &'static dyn Scene) -> Self {
        CurrentScene(scene, None)
    }

    fn change(&mut self, scene: &'static dyn Scene) -> bool {
        // Don't change scene if being set to the same scene. Implement a specific `restart` method
        // if that is ever required.
        if self.0 as *const dyn Scene == scene as *const dyn Scene {
            false
        } else {
            self.1 = Some(scene);
            true
        }
    }

    /// The [`Scene`] that is currently active
    pub fn current(&self) -> &'static dyn Scene {
        self.0
    }

    pub(crate) fn transition(&mut self) -> Option<(&'static dyn Scene, &'static dyn Scene)> {
        let new = self.1?;
        let old = self.0;
        self.0 = new;
        self.1 = None;
        Some((old, new))
    }
}

/// A `SystemData` that handles changing scenes.
#[derive(SystemData)]
pub struct SceneManager<'a> {
    current_scene: Write<'a, CurrentScene>,
    entities: Entities<'a>,
    scene_member: ReadStorage<'a, SceneMember>,
    delete: WriteStorage<'a, Delete>,
}

impl<'a> SceneManager<'a> {
    /// Changes to a new scene. If the scene is the same as the current scene, it won't change.
    pub fn change(&mut self, scene: &'static dyn Scene) {
        if self.current_scene.change(scene) {
            for (entity, _) in (&*self.entities, &self.scene_member).join() {
                self.delete.insert(entity, Delete::default()).unwrap();
            }
        }
    }
}

/// Provides methods to handle the creation of a Scene
pub struct SceneBuilder<'a> {
    world: &'a mut World,
}

impl<'a> SceneBuilder<'a> {
    pub(crate) fn new(world: &'a mut World) -> Self {
        SceneBuilder { world }
    }

    /// Runs a system immediately as part of the setup process. This system will not be used as
    /// part of any dispatcher
    pub fn run_now<S>(&mut self, mut system: S) -> &mut Self
    where S: for<'d> System<'d> + Send {
        system.run_now(&mut self.world.res);
        self
    }

    /// Builds an entity, adding it to the scene.
    pub fn add_entity<E: EntityFactory>(&mut self, factory: E) -> &mut Self {
        factory
            .build(self.world.create_entity())
            .with(SceneMember::default())
            .build();
        self
    }

    /// Builds an entity, but does not associate it with the scene. At the end of the scene, this
    /// entity will not be destroyed automatically.
    pub fn add_to_world<E: EntityFactory>(&mut self, factory: E) -> &mut Self {
        factory
            .build(self.world.create_entity())
            .build();
        self
    }

    /// Gets a resource from the world immutably
    pub fn get_resource<T: 'static + Sync + Send>(&self) -> Fetch<'_, T> {
        self.world.read_resource()
    }

    /// Gets a resource from the world mutably
    pub fn get_resource_mut<T: 'static + Sync + Send>(&self) -> FetchMut<'_, T> {
        self.world.write_resource()
    }

    /// Pipes the builder through a function
    pub fn pipe(&mut self, f: impl Fn(&mut Self)) -> &mut Self {
        f(self);
        self
    }
}

/// Defines a Scene
pub trait Scene: Sync {
    /// Called when a scene is started. It is expected to create entities, add systems, and perform
    /// other setup required for this scene.
    fn start<'a>(&self, builder: SceneBuilder<'a>);

    /// Called when a scene is ended. It is expected to perform any teardown for this scene. It is
    /// *not* required to destroy any entities or remove any systems, as that is handled automatically.
    #[allow(unused_variables)]
    fn end<'a>(&self, builder: SceneBuilder<'a>) {}

    /// The size of this Scene
    fn bounds(&self) -> crate::model::shape::Rect;
}
