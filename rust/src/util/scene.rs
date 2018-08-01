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
                $(,)*
            ]
        } => |$builder:ident| $body:block
    ) => (
        struct SceneStruct;

        impl $crate::scene::Scene for SceneStruct {
            fn start<'a>(&self, mut $builder: $crate::scene::SceneBuilder<'a>) {
                let $builder = $builder
                    $(.add_entity($entity))*;
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
                $(,)*
            ]
        } => |$builder:ident| $body:block
    ) => (
        struct SceneStruct;

        impl $crate::scene::Scene for SceneStruct {
            fn start<'a>(&self, mut $builder: $crate::scene::SceneBuilder<'a>) {
                let $builder = $builder
                    $(.add_entity($entity))*;
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
                $(,)*
            ]
        }
    ) => (
        struct SceneStruct;

        impl $crate::scene::Scene for SceneStruct {
            fn start<'a>(&self, mut builder: $crate::scene::SceneBuilder<'a>) {
                builder
                    $(.add_entity($entity))*;
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
                $(,)*
            ]
        }
    ) => (
        struct SceneStruct;

        impl $crate::scene::Scene for SceneStruct {
            fn start<'a>(&self, mut builder: $crate::scene::SceneBuilder<'a>) -> $crate::scene::SceneBuilder<'a> {
                builder
                    $(.add_entity($entity))*;
            }
        }
        #[allow(non_upper_case_globals)]
        $(#[$attr])*
        static $name: &'static dyn $crate::scene::Scene = &SceneStruct;
    );
}
