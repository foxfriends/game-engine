use piston_window::Input;
use super::types::{Point,Rectangle};

/// An Identifier identifies an Actor as an individual and as a member of its class
#[derive(Eq,Clone,Copy)]
pub struct Identifier {
    id: usize,
    class: usize,
}
impl PartialEq for Identifier {
    fn eq(&self, rhs: &Self) -> bool { self.id == rhs.id }
}

/// An ActorFactor provides a standardized method of producing actors
pub trait ActorFactory<T: Actor> {
    fn new(id: usize) -> T;
}

/// An Actor is any object that can appear in the game
pub trait Actor {
    /// All actors must hold or be able to produce an Identifier
    fn id(&self) -> Identifier;
}

impl PartialEq for Actor {
    fn eq(&self, rhs: &Self) -> bool { self.id() == rhs.id() }
}
impl Eq for Actor {}

/// An Active Actor is one that updates on its own each frame
pub trait Active: Actor {
    /// Performs the update action for this Actor
    fn act(&self);
}

/// A Reactive Actor is one that can react to inputs
pub trait Reactive: Actor {
    /// Processes the input that has been received from the player
    fn react(&self, input: Input);
}

/// A Visible Actor is one that has a visual representation to the player
pub trait Visible: Actor {
    /// Draws the Actor to the screen using the provided graphics interface
    ///
    /// TODO: make this usable
    fn draw(&self);
}

/// A Located Actor is one which has a specific physical location in the game world
pub trait Located: Actor {
    fn location(&self) -> Point;
}

/// A Collidable Actor is one that may interact physically with another
pub trait Collidable: Actor {
    /// The bounding box provides a rectangle which can be quickly checked for collisions
    fn bounding_box(&self) -> Rectangle;
    /// Checks whether two Collidable Actors are actually collding
    fn collides_with(&self, other: Collidable) -> bool;
}
