use std::collections::HashMap;
use std::ops::Range;
use sdl2::mixer::{Music, Chunk, allocate_channels, channel};
use std::path::Path;

/// A `SoundID` is used by the engine to identify sounds without exposing the actual `Chunk` objects
/// to the user
#[derive(Copy,Clone,PartialEq,Eq,Hash)]
pub struct SoundID(&'static str);
impl SoundID {
    pub fn new(name: &'static str) -> SoundID {
        SoundID(name)
    }
}

/// A `MusicID` is used by the engine to identify tracks without exposing the actual `Music` objects
/// to the user
#[derive(Copy,Clone,PartialEq,Eq,Hash)]
pub struct MusicID(&'static str);
impl MusicID {
    pub fn new(name: &'static str) -> Self {
        MusicID(name)
    }
}

/// A `SoundChannel` groups actual channels from the audio system into a single purpose to facilitate
/// scheduling and organization of currently playing sounds.
///
/// At times, this may reduce the optimal usage of the sound system, requiring it to allocate more
/// channels than is strictly necessary at any one time. This does, however, make it easier to
/// reason about playing sounds as the engine's user, and may in future be restructured internally
/// to make more effective usage of the sound system.
#[derive(Copy,Clone,PartialEq,Eq,Hash)]
pub enum SoundChannel {
    Effect,
    Monster,
    Voice,
}

/// The `AudioStore` manages the loaded Music and Chunk objects, and the channels for sound
/// effects.
pub(super) struct AudioStore {
    music: HashMap<MusicID, Music<'static>>,
    sound: HashMap<SoundID, Chunk>,
    channels: HashMap<SoundChannel, Range<usize>>,
    channel_count: usize,
}

impl AudioStore {
    /// Create a new AudioStore
    pub fn new() -> Self {
        Self {
            music: HashMap::new(),
            sound: HashMap::new(),
            channels: HashMap::new(),
            channel_count: 0,
        }
    }

    /// Designates some number of actual channels that will be used under the named
    /// [`SoundChannel`](enum.SoundChannel.html).
    pub fn set_channels(mut self, channel: SoundChannel, count: usize) -> Self {
        self.channels.insert(channel, self.channel_count..self.channel_count + count);
        self.channel_count += count;
        self
    }

    /// Actually allocates the space required for the previously set channels.
    ///
    /// Must be called before trying to play any sounds.
    pub fn allocate(self) -> Self {
         allocate_channels(self.channel_count as i32);
         self
    }

    /// Ensures that the sound corresponding to the provided [`SoundID`](struct.SoundID.html) is
    /// loaded. If the sound is not yet loaded, it will be loaded immediately.
    ///
    /// It is recommended to load all sounds that will be needed, particularly large ones,
    /// pre-emptively so that there is no delay from when the sound is meant to be played and when
    /// it is heard.
    pub fn ensure_sound(&mut self, id: SoundID) {
        if !self.sound.contains_key(&id) {

            let sound = Chunk::from_file(Path::new(id.0)).unwrap();
            self.sound.insert(id, sound);
        }
    }

    /// Plays the sound that corresponds to the given [`SoundID`](struct.SoundID.html) on the
    /// provided [`SoundChannel`](enum.SoundChannel.html). It is recommended to group sounds of
    /// similar purpose onto the right channels for future optimization.
    ///
    /// In the case that a [`SoundID`](type.SoundID.html) has not yet be linked to a concrete
    /// `Chunk`, the file will be loaded.
    pub fn play_sound(&mut self, id: SoundID, ch: SoundChannel) {
        self.ensure_sound(id);
        if let Some(range) = self.channels.get(&ch) {
            for i in range.clone() {
                let chan = channel(i as i32);
                if !chan.is_playing() {
                    chan.play(&self.sound.get(&id).unwrap(), 0).unwrap();
                }
            }
        }
    }

    /// Stops the sound that corresponds to the given [`SoundID`](struct.SoundID.html) which is
    /// playing on the provided [`SoundChannel`](enum.SoundChannel.html). If the sound is not
    /// playing or has not been loaded, nothing will happen.
    pub fn stop_sound(&mut self, id: SoundID, ch: SoundChannel) {
        if let (Some(sound), Some(range)) = (self.sound.get(&id), self.channels.get(&ch)) {
            for i in range.clone() {
                let chan = channel(i as i32);
                if let Some(playing) = chan.get_chunk() {
                    if &playing == sound {
                        chan.halt();
                    }
                }
            }
        }
    }

    /// Ensures that the music corresponding to the provided [`MusicID`](struct.MusicID.html) is
    /// loaded. If the sound is not yet loaded, it will be loaded immediately.
    ///
    /// It is recommended to load any music that will be needed early so there is no delay when it
    /// will be needed.
    pub fn ensure_music(&mut self, id: MusicID) {
        if !self.music.contains_key(&id) {
             let music = Music::from_file(Path::new(id.0)).unwrap();
             self.music.insert(id, music);
        }
    }

    /// Plays the music that corresponds to the given [`MusicID`](struct.MusicID.html).
    /// If there is any music already playing it will be stopped before starting the new one.
    ///
    /// In the case that a [`MusicID`](type.MusicID.html) has not yet be linked to a concrete
    /// `Music`, the file will be loaded.
    pub fn play_music(&mut self, id: MusicID) {
        self.ensure_music(id);
        self.music.get(&id).unwrap().play(-1).unwrap();
    }

    /// Stops the currently playing music, if there is any.
    pub fn stop_music(&mut self) {
        Music::halt();
    }

    /// Clears all loaded music files from memory, including any currently playing. Playing music
    /// will be stopped.
    ///
    /// It is recommended to do this whenever the required tracks will be changing soon, such as
    /// when changing areas in the game, or switching into a battle.
    pub fn clear_music(&mut self) {
        self.stop_music();
        self.music.clear();
    }

    /// Clears all loaded sounds files from memory. If any are playing, they will stop immediately
    /// and also be cleared.
    ///
    /// It is recommended to do this whenever the current sound files are likely to be no longer
    /// needed.
    pub fn clear_sounds(&mut self) {
        self.sound.clear();
    }

    // TODO: provide more fine-grained support for removing sound/music that will be unused.
}
