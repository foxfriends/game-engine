//! Some resources that help keep track of the passing of time
use std::time::SystemTime;
use std::num::Wrapping;

/// How many frames have passed since starting the game. If it somehow reaches MAX, it will
/// restart the counter.
#[derive(Copy, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Default)]
pub struct FrameCount(Wrapping<u128>);

impl FrameCount {
    /// Increments the frame by one
    pub(crate) fn next(&mut self) {
        self.0 += Wrapping(1);
    }

    /// The current frame index
    pub fn current(&self) -> u128 {
        (self.0).0
    }
}

/// How much time has passed since starting the game.
#[derive(Copy, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug)]
pub struct RunTime(SystemTime);

impl Default for RunTime {
    fn default() -> Self {
        return RunTime(SystemTime::now())
    }
}
