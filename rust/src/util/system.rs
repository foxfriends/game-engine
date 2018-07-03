//! Defines a macro that helps with implementing systems

/// A macro that helps with generating the [`System`](::specs::prelude::System) implementation.
///
/// Probably not a lot better than just implementing it manually, but I think its ok.
///
/// # Examples
///```rust
/// # #![feature(macro_lifetime_matcher)]
/// # #[macro_use] extern crate house_makes_engine;
/// # extern crate specs;
/// # #[macro_use] extern crate specs_derive;
/// # use specs::prelude::*;
/// #
/// # type Gravity = i32;
/// # #[derive(Component)]
/// # struct Velocity(i32);
/// # impl ::std::ops::AddAssign<i32> for Velocity {
/// #     fn add_assign(&mut self, amt: i32) { self.0 += amt; }
/// # }
/// #
/// /// Causes everything that has a [`Velocity`] to accelerate constantly according
/// /// to the [`Gravity`] resource
/// #[derive(Default)]
/// struct AccelerationDueToGravity;
///
/// system! {
///     impl AccelerationDueToGravity {
///         fn run(
///             &mut self,
///             gravity: &Resource<Gravity>,
///             velocity: &mut Component<Velocity>,
///         ) {
///             for vel in (&mut velocity).join() {
///                 *vel += *gravity;
///             }
///         }
///     }
/// }
/// #
/// # fn main() {}
/// ```
#[macro_export]
macro_rules! system {
    ([$parsed:ty] @data $life:lifetime []) => ($parsed);
    ($([$parsed:ty])* @data $life:lifetime []) => (($($parsed),*));
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &Resource<$type:ty> $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [::specs::prelude::Read<$life, $type>] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &mut Resource<$type:ty> $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [::specs::prelude::Write<$life, $type>] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &Option<Resource<$type:ty> > $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [Option<::specs::prelude::Read<$life, $type>>] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &mut Option<Resource<$type:ty> > $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [Option<::specs::prelude::Write<$life, $type>>] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &ExpectResource<$type:ty> $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [::specs::prelude::ReadExpect<$life, $type>] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &mut ExpectResource<$type:ty> $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [::specs::prelude::WriteExpect<$life, $type>] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &Component<$type:ty> $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [::specs::prelude::ReadStorage<$life, $type>] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &mut Component<$type:ty> $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [::specs::prelude::WriteStorage<$life, $type>] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &Entities $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [::specs::prelude::Entities<$life>] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &LazyUpdate $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [::specs::prelude::Read<$life, ::specs::prelude::LazyUpdate>] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &$type:ty $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [$type] @data $life [$($rest)*])
    );
    ($([$parsed:ty])* @data $life:lifetime [
        $name:ident : &mut $type:ty $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$parsed])* [$type] @data $life [$($rest)*])
    );

    ([$parsed:tt] @params []) => ($parsed);
    ($([$($parsed:tt)*])* @params []) => (($($($parsed)*),*));
    ($([$($parsed:tt)*])* @params [
        $name:ident : &$type:ty $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$($parsed)*])* [$name] @params [$($rest)*])
    );
    ($([$($parsed:tt)*])* @params [
        $name:ident : &mut $type:ty $(,)+
        $($rest:tt)*
    ]) => (
        system!($([$($parsed)*])* [mut $name] @params [$($rest)*])
    );

    (
        impl<$life:lifetime> $name:ident {
            fn run(
                &mut self,
                $($params:tt)*
            ) $fn:block
        }
    ) => {
        impl<$life> ::specs::prelude::System<$life> for $name {
            type SystemData = system!(@data $life [$($params)*]);

            fn run(&mut self, system!(@params [$($params)*]): Self::SystemData) {
                #[allow(unused_imports)] use specs::prelude::*;
                $fn
            }
        }
    };

    (
        impl $name:ident {
            fn run(
                &mut self,
                $($params:tt)*
            ) $fn:block
        }
    ) => {
        impl<'a> ::specs::prelude::System<'a> for $name {
            type SystemData = system!(@data 'a [$($params)*]);

            fn run(&mut self, system!(@params [$($params)*]): Self::SystemData) {
                #[allow(unused_imports)] use specs::prelude::*;
                $fn
            }
        }
    };

    (
        impl $name:ident {
            fn run(
                &mut self $(,)*
            ) $fn:block
        }
    ) => {
        impl<'a> ::specs::prelude::System<'a> for $name {
            type SystemData = ();

            fn run(&mut self, (): ()) {
                #[allow(unused_imports)] use specs::prelude::*;
                $fn
            }
        }
    };
}
