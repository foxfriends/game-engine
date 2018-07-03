//! Resources for handling text input

use sdl2::keyboard::TextInputUtil;

/// A resource that manages the state of the text input system. Any modifications to the state of
/// the text input system will take effect at the *end* of the frame.
#[derive(Default, Clone, Copy, Debug)]
pub struct TextInput {
    started: bool,
}

impl TextInput {
    /// Checks if text input is currently being accepted
    pub fn is_active(&self) -> bool {
        self.started
    }

    /// Starts accepting text input
    pub fn start(&mut self) {
        self.started = true;
    }

    /// Stops accepting text input
    pub fn stop(&mut self) {
        self.started = false;
    }

    /// Updates the state of the actual text input system based on what is stored in this struct.
    pub(crate) fn sync_to(&self, text_input: &TextInputUtil) {
        if self.started && !text_input.is_active() {
            text_input.start();
        } else if !self.started && text_input.is_active() {
            text_input.stop();
        }
    }
}

/// An event that occurs as part of the text input system
#[derive(Clone, Eq, PartialEq, Debug)]
pub enum TextInputEvent {
    /// Backspace was pressed, so a character backward should be removed
    Backspace,
    /// Delete was pressed, so a character forward should be removed
    Delete,
    /// The left arrow key was pressed, so the cursor should move left
    MoveLeft,
    /// The right arrow key was pressed, so the cursor should move right
    MoveRight,
    /// Some characters were input, and should be added to the processed string
    Input(String),
}

/// A list of recent [`TextInputEvent`]s
#[derive(Default)]
pub struct TextInputEvents(Vec<TextInputEvent>);

impl TextInputEvents {
    pub(crate) fn clear(&mut self) {
        self.0.clear();
    }

    pub(crate) fn add(&mut self, event: TextInputEvent) {
        self.0.push(event);
    }

    /// An iterator over all of the [`KeyboardEvents`]s
    pub fn iter<'a>(&'a self) -> impl Iterator<Item = TextInputEvent> + 'a {
        self.0.iter().cloned()
    }
}
