use super::message::{GameMessage, Dispatch};
use super::canvas::Canvas;

/// A `Model` is used to represent the current state of the game, and can react to its own state
/// and [`Message`](enum.Message.html)s passed in from the game engine.
pub trait Model<Msg: Copy + Clone>: Sync + Send {
    /// Receives and reacts to the user defined generic messages
    fn relay(&mut self, Msg, Dispatch<Msg>);
    /// Updates the `Model` given no inputs, based solely on the current state of the `Model`
    fn update(&mut self, Dispatch<Msg>);
    /// Receives and reacts to [`GameMessage`](enum.GameMessage.html)s
    fn process(&mut self, GameMessage, Dispatch<Msg>);
    /// Renders the `Model` to the provided [`Canvas`](struct.Canvas.html)
    fn render(& self, &mut Canvas);
}
