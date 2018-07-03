//! Handles scenes, which automatically create entities when they are started, and clean up
//! entities when they end.

use shred::{Fetch, FetchMut};
use specs::prelude::*;

use common::{SceneMember, Delete};
use util::entity_factory::EntityFactory;

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

    /// Starts the scene
    pub(crate) fn current(&self) -> &'static dyn Scene {
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
pub struct SceneBuilder<'a, 'b, 'c> {
    world: &'a mut World,
    dispatcher: DispatcherBuilder<'b, 'c>,
}

impl<'a, 'b, 'c> SceneBuilder<'a, 'b, 'c> {
    pub(crate) fn new(world: &'a mut World) -> Self {
        SceneBuilder {
            world,
            dispatcher: DispatcherBuilder::new(),
        }
    }

    /// Adds a system to the scene. This system will stop being run when the scene ends
    pub fn add_system<S>(mut self, system: S, name: &str, dependencies: &[&str]) -> Self
    where S: for<'d> System<'d> + Send + 'b {
        self.dispatcher.add(system, name, dependencies);
        self
    }

    /// Builds an entity, adding it to the scene.
    pub fn add_entity<E: EntityFactory>(self, factory: E) -> Self {
        factory
            .build(self.world.create_entity())
            .with(SceneMember::default())
            .build();
        self
    }

    /// Builds an entity, but does not associate it with the scene. At the end of the scene, this
    /// entity will not be destroyed automatically.
    pub fn add_to_world<E: EntityFactory>(self, factory: E) -> Self {
        factory
            .build(self.world.create_entity())
            .build();
        self
    }

    /// Gets a resource from the world immutably
    pub fn get_resource<T: 'static + Sync + Send>(&self) -> Fetch<T> {
        self.world.read_resource()
    }

    /// Gets a resource from the world mutably
    pub fn get_resource_mut<T: 'static + Sync + Send>(&self) -> FetchMut<T> {
        self.world.write_resource()
    }

    /// Consumes this [`SceneBuilder`] to retrieve the [`DispatcherBuilder`] inside
    pub(crate) fn dispatcher(self) -> DispatcherBuilder<'b, 'c> {
        self.dispatcher
    }
}

/// Defines a Scene
pub trait Scene: Sync {
    /// Called when a scene is started. It is expected to create entities, add systems, and perform
    /// other setup required for this scene.
    fn start<'a, 'b, 'c>(&self, builder: SceneBuilder<'a, 'b, 'c>) -> SceneBuilder<'a, 'b, 'c>;

    /// Called when a scene is ended. It is expected to perform any teardown for this scene. It is
    /// *not* required to destroy any entities or remove any systems, as that is handled automatically.
    fn end<'a, 'b, 'c>(&self, builder: SceneBuilder<'a, 'b, 'c>) -> SceneBuilder<'a, 'b, 'c> { builder }
}
