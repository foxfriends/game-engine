//! Macro for generating scenes

/// Macro for generating scenes. Handles setting up entities and systems, but any more advanced
/// setup must be done manually.
#[macro_export]
macro_rules! scene {
    (
        $(#[$attr:meta])*
        $name:ident {
            entities: [
                $($entity:expr),*
                $(,)?
            ],
            systems: [
                $(($system:expr, $sysname:expr, $sysdeps:expr)),*
                $(,)?
            ]
        } => |$builder:ident| $body:block
    ) => (
        struct SceneStruct;

        impl $crate::scene::Scene for SceneStruct {
            fn start<'a, 'b, 'c>(&self, $builder: $crate::scene::SceneBuilder<'a, 'b, 'c>) -> $crate::scene::SceneBuilder<'a, 'b, 'c> {
                let $builder = $builder
                    $(.add_entity($entity))*
                    $(.add_system($system, $sysname, $sysdeps))*;
                $body
            }
        }
        #[allow(non_upper_case_globals)]
        $(#[$attr])*
        static $name: &'static dyn $crate::scene::Scene = &SceneStruct;
    );

    (
        $(#[$attr:meta])*
        pub $name:ident {
            entities: [
                $($entity:expr),*
                $(,)?
            ],
            systems: [
                $(($system:expr, $sysname:expr, $sysdeps:expr)),*
                $(,)?
            ]
        } => |$builder:ident| $body:block
    ) => (
        struct SceneStruct;

        impl $crate::scene::Scene for SceneStruct {
            fn start<'a, 'b, 'c>(&self, $builder: $crate::scene::SceneBuilder<'a, 'b, 'c>) -> $crate::scene::SceneBuilder<'a, 'b, 'c> {
                let $builder = $builder
                    $(.add_entity($entity))*
                    $(.add_system($system, $sysname, $sysdeps))*;
                $body
            }
        }
        #[allow(non_upper_case_globals)]
        $(#[$attr])*
        pub static $name: &'static dyn $crate::scene::Scene = &SceneStruct;
    );

    (
        $(#[$attr:meta])*
        pub $name:ident {
            entities: [
                $($entity:expr),*
                $(,)?
            ],
            systems: [
                $(($system:expr, $sysname:expr, $sysdeps:expr)),*
                $(,)?
            ]
        }
    ) => (
        struct SceneStruct;

        impl $crate::scene::Scene for SceneStruct {
            fn start<'a, 'b, 'c>(&self, builder: $crate::scene::SceneBuilder<'a, 'b, 'c>) -> $crate::scene::SceneBuilder<'a, 'b, 'c> {
                builder
                    $(.add_entity($entity))*
                    $(.add_system($system, $sysname, $sysdeps))*
            }
        }
        #[allow(non_upper_case_globals)]
        $(#[$attr])*
        pub static $name: &'static dyn $crate::scene::Scene = &SceneStruct;
    );

    (
        $(#[$attr:meta])*
        $name:ident {
            entities: [
                $($entity:expr),*
                $(,)?
            ],
            systems: [
                $(($system:expr, $sysname:expr, $sysdeps:expr)),*
                $(,)?
            ]
        }
    ) => (
        struct SceneStruct;

        impl $crate::scene::Scene for SceneStruct {
            fn start<'a, 'b, 'c>(&self, builder: $crate::scene::SceneBuilder<'a, 'b, 'c>) -> $crate::scene::SceneBuilder<'a, 'b, 'c> {
                builder
                    $(.add_entity($entity))*
                    $(.add_system($system, $sysname, $sysdeps))*
            }
        }
        #[allow(non_upper_case_globals)]
        $(#[$attr])*
        static $name: &'static dyn $crate::scene::Scene = &SceneStruct;
    );
}
