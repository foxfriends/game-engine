//! This is the entry point of the game engine which is based on SDL2. Though this is not something
//! that should be exposed to the user, there are a few places where this comes through. Hopefully
//! those will be patched someday.
//!
//! A user creates a game by creating a [`Model`](trait.Model.html) and passing it in to be run.
//! The actual implementation of the model does not matter, and can be nested arbitrarily deep and
//! use any sort of structures within so long it conforms to the basic required interface.

use std::sync::{Arc, Mutex};
use std::sync::mpsc::channel;
use std::thread;
use std::time::Duration;
use std::collections::HashMap;
use sdl2;

// NOTE: `pub` only for documentation purposes. Should become private when support for documenting
// private things becomes better.
pub mod canvas;
pub mod model;
pub mod message;
pub mod shape;
pub mod audio;

pub use self::canvas::*;
pub use self::model::*;
pub use self::message::*;
pub use self::shape::*;

/// Starts up a game based on the provided [`Model`](trait.Model.html). This function is the core
/// of the game engine, and its only entry point.
///
/// This function will block the current thread to use it as the rendering and event processing
/// thread. Additional threads will be spawned for asyncrhonous messages, audio (hopefully), and
/// debugging (if that proves useful in the future).
pub fn run<Msg: 'static + Copy + Clone + Sync + Send, T: 'static + Model<Msg>>(raw_model: T) {
    let model = Arc::new(Mutex::new(raw_model));
    let sdl = sdl2::init().unwrap();
    let mut event_pump = sdl.event_pump().unwrap();
    let video = sdl.video().unwrap();
    let _audio = sdl.audio().unwrap();
    let _image_context = sdl2::image::init(sdl2::image::INIT_PNG).unwrap();
    let window = video
        .window("Phoenix Initiative", 1024, 768)
        .position_centered()
        .opengl()
        .build()
        .unwrap();

    let mut sdl_canvas = window.into_canvas().build().unwrap();
    let texture_creator = sdl_canvas.texture_creator();
    let mut canvas = Canvas{
        canvas: &mut sdl_canvas,
        texture_creator: &texture_creator,
        textures: HashMap::new(),
    };

    let (to_game,  game)  = channel::<GameMessage>();
    let (to_audio, audio) = channel::<AudioMessage>();
    let (to_relay, relay) = channel::<Msg>();
    let (to_debug, debug) = channel::<&'static str>();
    let (to_dispatch, dispatch) = channel::<Message<Msg>>();

    thread::Builder::new().name("dispatch".to_string()).spawn(move || {
        use self::Message::*;
        for message in dispatch.iter() {
            match message {
                Game (msg) => { to_game .send(msg).unwrap(); }
                Audio(msg) => { to_audio.send(msg).unwrap(); }
                Debug(msg) => { to_debug.send(msg).unwrap(); }
                Relay(msg) => { to_relay.send(msg).unwrap(); }
            }
        }
    }).unwrap();

    let game_model = model.clone();
    let game_to_dispatch = to_dispatch.clone();
    let game_dispatch = move |msg| { game_to_dispatch.send(msg).unwrap(); };
    thread::Builder::new().name("game".to_string()).spawn(move || {
        for msg in game.iter() {
            let mut model = game_model.lock().unwrap();
            model.process(msg, &game_dispatch);
        }
    }).unwrap();

    let relay_model = model.clone();
    let relay_to_dispatch = to_dispatch.clone();
    let relay_dispatch = move |msg| { relay_to_dispatch.send(msg).unwrap(); };
    thread::Builder::new().name("relay".to_string()).spawn(move || {
        for msg in relay.iter() {
            let mut model = relay_model.lock().unwrap();
            model.relay(msg, &relay_dispatch);
        }
    }).unwrap();

    thread::Builder::new().name("audio".to_string()).spawn(move || {
        use self::AudioMessage::*;
        use self::audio::SoundChannel::*;
        let _mixer_context = sdl2::mixer::init(sdl2::mixer::INIT_OGG).unwrap();
        let frequency = 44100;
        let format = sdl2::mixer::AUDIO_S16LSB;
        let channels = sdl2::mixer::DEFAULT_CHANNELS;
        let chunk_size = 1024;
        sdl2::mixer::open_audio(frequency, format, channels, chunk_size).unwrap();

        let channel_count = 4;
        sdl2::mixer::allocate_channels(channel_count);
        let mut store = audio::AudioStore::new()
            .set_channels(Effect, 4)
            .set_channels(Monster, 4)
            .set_channels(Voice, 2)
            .allocate();

        for msg in audio.iter() {
            match msg {
                Play(sound, channel) => store.play_sound(sound, channel),
                Stop(sound, channel) => store.stop_sound(sound, channel),
                PlayMusic(music) => store.play_music(music),
                StopMusic => store.stop_music(),
            }
        }
    }).unwrap();

    thread::Builder::new().name("debug".to_string()).spawn(move || {
        for msg in debug.iter() {
            println!("{:?}", msg);
        }
    }).unwrap();

    let primary_dispatch = move |msg| { to_dispatch.send(msg).unwrap(); };
    'game: loop {
        for event in event_pump.poll_iter() {
            use self::Message::*;
            use self::GameMessage::*;
            use sdl2::event::Event;
            match event {
                Event::KeyDown { scancode, .. } =>
                    if scancode.is_some() {
                        primary_dispatch(Game(KeyDown(scancode.unwrap())));
                    },
                Event::KeyUp { scancode, .. } =>
                    if scancode.is_some() {
                        primary_dispatch(Game(KeyUp(scancode.unwrap())));
                    },
                Event::Quit {..} => break 'game,
                _ => continue,
            }
        }

        thread::sleep(Duration::new(0, 1_000_000_000u32 / 60));

        if let Ok(mut m) = model.lock() {
            m.update(&primary_dispatch);
            canvas.draw_set_color(sdl2::pixels::Color::RGB(0, 0, 0));
            canvas.draw_clear();
            m.render(&mut canvas);
        }

        canvas.present();
    }
}
