//! A simple resource that provides a quitting mechanic

use std::ops::Deref;

/// A simple resource that provides a quitting mechanic
#[derive(Default)]
pub struct Quit(bool);

impl Quit {
    /// Causes the game to quit at the end of this step
    pub fn quit(&mut self) {
        self.0 = true;
    }
}

impl Deref for Quit {
    type Target = bool;

    fn deref(&self) -> &bool {
        &self.0
    }
}
