//! Takes an EntityBuilder and builds the entity.


use specs::world::Builder;

/// Defines a type that can be used to build an entity
pub trait EntityFactory {
    /// Builds the entity using the [`EntityBuilder`]
    fn build<B: Builder>(self, builder: B) -> B;
}

/// Creates an [`EntityFactory`](self::EntityFactory) function, which builds an entity with the listed components.
/// The factory may take parameters, which can then be used in the component list.
///
/// Generates a struct which can be instantiated and passed to [`SceneBuilder::add_entity`](::scene::SceneBuilder::add_entity)
///
/// # Examples
/// ```
/// # #![feature(macro_lifetime_matcher)]
/// # #[macro_use] extern crate house_makes_engine as engine;
/// # extern crate specs;
/// # #[macro_use] extern crate specs_derive;
/// #
/// # use specs::prelude::*;
/// # use engine::Game;
/// #
/// # #[derive(Component)]
/// # pub struct AttackRange(u32);
/// # impl AttackRange {
/// #     fn new(rng: u32) -> Self { AttackRange(rng) }
/// # }
/// #
/// # #[derive(Component)]
/// # pub struct AttackDamage(u32);
/// # impl AttackDamage {
/// #     fn new(dmg: u32) -> Self { AttackDamage(dmg) }
/// # }
/// #
/// # #[derive(Component)]
/// # pub struct Health(u32);
/// # impl Health {
/// #     fn new(hp: u32) -> Self { Health(hp) }
/// # }
/// #
/// entity! {
///     /// This tree is evil and will attack the player.
///     pub EvilTree(dmg: u32, hp: u32) {
///         AttackRange::new(30),
///         AttackDamage::new(dmg),
///         Health::new(hp),
///     }
/// }
/// #
/// # fn main() { }
/// ```
#[macro_export]
macro_rules! entity {
    (@build $builder:expr) => { $builder };
    (@build $builder:expr, { $($comp:expr),* $(,)* }) => {
        $builder
            $(.with($comp))*
    };

    ($(#[$attr:meta])* pub $name:ident ( $($param:ident : $type:ty ),+ $(,)* ) $body:tt) => {
        $(#[$attr])*
        pub struct $name($(pub $type),*);
        impl $crate::util::entity_factory::EntityFactory for $name {
            fn build<B: ::specs::world::Builder>(self, builder: B) -> B {
                let $name($($param),+) = self;
                entity!(@build builder, $body)
                    .with($crate::common::Create::default())
            }
        }
    };

    ($(#[$attr:meta])* $name:ident ( $($param:ident : $type:ty ),+ $(,)* ) $body:tt) => {
        $(#[$attr])*
        struct $name($(pub $type),*);
        impl $crate::util::entity_factory::EntityFactory for $name {
            fn build<B: ::specs::world::Builder>(self, builder: B) -> B {
                let $name($($param),+) = self;
                entity!(@build builder, $body)
                    .with($crate::common::Create::default())
            }
        }
    };

    ($(#[$attr:meta])* pub $name:ident $body:tt) => {
        $(#[$attr])*
        pub struct $name;
        impl $crate::util::entity_factory::EntityFactory for $name {
            fn build<B: ::specs::world::Builder>(self, builder: B) -> B {
                entity!(@build builder, $body)
                    .with($crate::common::Create::default())
            }
        }
    };

    ($(#[$attr:meta])* $name:ident $body:tt) => {
        $(#[$attr])*
        struct $name;
        impl $crate::util::entity_factory::EntityFactory for $name {
            fn build<B: ::specs::world::Builder>(self, builder: B) -> B {
                entity!(@build builder, $body)
                    .with($crate::common::Create::default())
            }
        }
    };
}
