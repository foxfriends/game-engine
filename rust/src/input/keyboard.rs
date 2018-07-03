//! Resources that track the mouse state

use std::collections::HashSet;

/// A key on the keyboard
pub use sdl2::keyboard::Scancode as Key;

/// Resource that reflects the current state of the keyboardr
#[derive(Clone, PartialEq, Eq, Debug, Default)]
pub struct KeyboardState(HashSet<Key>);

/// A change in the state of the keyboard
#[derive(Copy, Clone, PartialEq, Eq, Debug)]
pub enum KeyboardEvent {
    /// A key has been released
    Release(Key),
    /// A key has been pressed
    Press(Key),
}

/// Resource that tracks changes in the mouse state
#[derive(Debug, Default)]
pub struct KeyboardEvents(Vec<KeyboardEvent>);

impl KeyboardEvents {
    pub(crate) fn clear(&mut self) {
        self.0.clear();
    }

    pub(crate) fn add(&mut self, event: KeyboardEvent) {
        self.0.push(event);
    }

    /// An iterator over all of the [`KeyboardEvents`]s
    pub fn iter<'a>(&'a self) -> impl Iterator<Item = KeyboardEvent> + 'a {
        self.0.iter().cloned()
    }
}

impl KeyboardState {
    pub(crate) fn press(&mut self, key: Key) {
        self.0.insert(key);
    }

    pub(crate) fn release(&mut self, key: Key) {
        self.0.remove(&key);
    }

    /// Whether the key is currently pressed
    pub fn key_pressed(&self, key: Key) -> bool {
        self.0.contains(&key)
    }
}
