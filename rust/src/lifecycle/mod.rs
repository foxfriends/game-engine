//! Manages the entity lifecycle components [`Create`] and [`Destroy`]

use common::{Create, Delete};

/// System that manages the entity lifecycle.
#[derive(Default)]
pub(crate) struct EntityLifecycle;

system! {
    impl EntityLifecycle {
        fn run(
            &mut self,
            entities: &Entities,
            create: &mut Component<Create>,
            delete: &Component<Delete>,
        ) {
            let created: Vec<_> = (&*entities, &create).join().map(|(entity, _)| entity).collect();
            for entity in created {
                create.remove(entity);
            }
            for (entity, _) in (&*entities, &delete).join() {
                entities.delete(entity).unwrap();
            }
        }
    }
}
