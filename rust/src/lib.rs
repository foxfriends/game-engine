//! A game engine!

#![warn(missing_docs, bare_trait_objects)]
#![feature(const_fn, macro_at_most_once_rep)]

extern crate sdl2;
extern crate specs;
extern crate shred;
extern crate serde;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate specs_derive;
#[macro_use] extern crate shred_derive;

use specs::prelude::*;
use sdl2::event::Event;
use shred::Resource;

mod error;
mod model;
#[macro_use] pub mod util;
pub mod common;
pub mod visuals;
pub mod input;
pub mod lifecycle;
pub mod quit;
pub mod scene;
pub mod timing;

pub use error::Error;
#[allow(missing_docs)]
pub type Result<T> = ::std::result::Result<T, Error>;

use quit::Quit;
use input::text::{TextInput, TextInputEvents, TextInputEvent};
use input::keyboard::{KeyboardEvents, KeyboardEvent, KeyboardState};
use input::mouse::{MouseEvents, MouseEvent, MouseButton, MouseState};
use visuals::{Visuals, Drawable};
use common::{Create, Delete, SceneMember};
use timing::{FrameCount, RunTime};
use lifecycle::EntityLifecycle;
use scene::{CurrentScene, Scene, SceneBuilder};

/// A game builder, which can be [`start`](Game::start)ed once everything is set up.
///
/// Note: Highly coupled to [`specs`]... Not sure if that's avoidable or not without implementing the
/// entire ECS system again, but this is probably ok...
pub struct Game {
    world: World,
    title: &'static str,
}

impl Game {
    /// Creates a new game builder
    pub fn new() -> Self {
        let mut world = World::new();

        world.register::<Drawable>();
        world.register::<Create>();
        world.register::<Delete>();
        world.register::<SceneMember>();

        Game {
            world,
            title: "",
        }
    }

    /// Sets the window title
    pub fn titled(self, title: &'static str) -> Self {
        Self {
            title,
            ..self
        }
    }

    /// Adds a resource to the `Game`. See [`specs::World::add_resource`] for documentation.
    pub fn add_resource<T: Resource>(mut self, resource: T) -> Self {
        self.world.add_resource(resource);
        self
    }

    /// Registers a component with this `Game`. See [`specs::World::register`] for documentation.
    pub fn register_component<C>(mut self) -> Self where C: Component, C::Storage: Default {
        self.world.register::<C>();
        self
    }

    /// Starts the game
    pub fn start<'a, 'b>(mut self, scene: &'static dyn Scene) -> ::Result<()> {
        // Set up SDL
        let sdl_context = sdl2::init()?;
        let _image_context = sdl2::image::init(sdl2::image::INIT_PNG)?;
        let ttf_context = sdl2::ttf::init()?;
        let video = sdl_context.video()?;

        let window = video.window(self.title, 1024, 768)
            .position_centered()
            .build()?;

        let text_input = video.text_input();

        // TODO: this unwrap?
        let canvas = window.into_canvas().build().unwrap();
        let mut event_pump = sdl_context.event_pump()?;

        self.world.add_resource(Quit::default());
        self.world.add_resource(MouseState::default());
        self.world.add_resource(MouseEvents::default());
        self.world.add_resource(KeyboardState::default());
        self.world.add_resource(KeyboardEvents::default());
        self.world.add_resource(TextInput::default());
        self.world.add_resource(TextInputEvents::default());
        self.world.add_resource(CurrentScene::starting_with(scene));
        self.world.add_resource(FrameCount::default());
        self.world.add_resource(RunTime::default());

        // Finalize the systems
        let mut render = Visuals::new(canvas, &ttf_context);

        // Play the game!
        let scene = self.world.read_resource::<CurrentScene>().current();
        let mut dispatcher: Dispatcher<'a, 'b> = {
            let scene_builder = SceneBuilder::new(&mut self.world);
            Game::finish_dispatcher(
                scene
                    .start(scene_builder)
                    .dispatcher()
            )
        };

        loop {
            // Reset previous state
            self.world.write_resource::<MouseEvents>().clear();
            self.world.write_resource::<KeyboardEvents>().clear();
            self.world.write_resource::<TextInputEvents>().clear();

            // TODO: this probably should be broken up in other files
            for event in event_pump.poll_iter() {
                match event {
                    Event::Quit{..} => self.world.write_resource::<Quit>().quit(),
                    Event::MouseButtonDown{ mouse_btn, x, y, .. } => {
                        use sdl2::mouse as sdl;
                        let mut mouse_state = self.world.write_resource::<MouseState>();
                        let point = model::shape::Point::new(x, y);
                        match mouse_btn {
                            sdl::MouseButton::Left => {
                                if !mouse_state.left {
                                    self.world.write_resource::<MouseEvents>().add(MouseEvent::Press(MouseButton::Left, point));
                                }
                                mouse_state.left = true;
                            }
                            sdl::MouseButton::Right => {
                                if !mouse_state.right {
                                    self.world.write_resource::<MouseEvents>().add(MouseEvent::Press(MouseButton::Right, point));
                                }
                                mouse_state.right = true;
                            }
                            sdl::MouseButton::Middle => {
                                if !mouse_state.middle {
                                    self.world.write_resource::<MouseEvents>().add(MouseEvent::Press(MouseButton::Middle, point));
                                }
                                mouse_state.middle = true;
                            },
                            _ => {},
                        }
                    }
                    Event::MouseButtonUp{ mouse_btn, x, y, .. } => {
                        use sdl2::mouse as sdl;
                        let mut mouse_state = self.world.write_resource::<MouseState>();
                        let point = model::shape::Point::new(x, y);
                        match mouse_btn {
                            sdl::MouseButton::Left => {
                                if mouse_state.left {
                                    self.world.write_resource::<MouseEvents>().add(MouseEvent::Release(MouseButton::Left, point));
                                }
                                mouse_state.left = false;
                            }
                            sdl::MouseButton::Right => {
                                if mouse_state.right {
                                    self.world.write_resource::<MouseEvents>().add(MouseEvent::Release(MouseButton::Right, point));
                                }
                                mouse_state.right = false;
                            }
                            sdl::MouseButton::Middle => {
                                if mouse_state.middle {
                                    self.world.write_resource::<MouseEvents>().add(MouseEvent::Release(MouseButton::Middle, point));
                                }
                                mouse_state.middle = false;
                            },
                            _ => {},
                        }
                    }
                    Event::MouseMotion{ x, y, xrel, yrel, .. } => {
                        let mut mouse_state = self.world.write_resource::<MouseState>();
                        mouse_state.x = x;
                        mouse_state.y = y;
                        self.world.write_resource::<MouseEvents>().add(MouseEvent::Move {
                            offset: model::shape::Point::new(xrel, yrel),
                            position: model::shape::Point::new(x, y),
                        });
                    }
                    Event::KeyDown { scancode: Some(scancode), repeat: false, .. } => {
                        self.world.write_resource::<KeyboardState>().press(scancode);
                        self.world.write_resource::<KeyboardEvents>().add(KeyboardEvent::Press(scancode));
                        if text_input.is_active() {
                            match scancode {
                                sdl2::keyboard::Scancode::Backspace =>
                                    self.world.write_resource::<TextInputEvents>().add(TextInputEvent::Backspace),
                                sdl2::keyboard::Scancode::Delete =>
                                    self.world.write_resource::<TextInputEvents>().add(TextInputEvent::Delete),
                                sdl2::keyboard::Scancode::Left =>
                                    self.world.write_resource::<TextInputEvents>().add(TextInputEvent::MoveLeft),
                                sdl2::keyboard::Scancode::Right =>
                                    self.world.write_resource::<TextInputEvents>().add(TextInputEvent::MoveRight),
                                _ => {}
                            }
                        }
                    }
                    Event::KeyUp { scancode: Some(scancode), repeat: false, .. } => {
                        self.world.write_resource::<KeyboardState>().release(scancode);
                        self.world.write_resource::<KeyboardEvents>().add(KeyboardEvent::Release(scancode));
                    }
                    Event::TextInput { text, .. } => {
                        self.world.write_resource::<TextInputEvents>().add(TextInputEvent::Input(text));
                        // TODO: handle the TextEditing events and things for typing CJK, etc.
                    }
                    // TODO: handle other event types
                    _ => {}
                }
            }

            // Do the things
            dispatcher.dispatch(&mut self.world.res);
            if **self.world.read_resource::<Quit>() {
                break;
            }

            self.world.read_resource::<TextInput>()
                .sync_to(&text_input);

            let transition = self.world.write_resource::<CurrentScene>().transition();
            if let Some((old, new)) = transition {
                old.end(SceneBuilder::new(&mut self.world));
                dispatcher = {
                    let scene_builder = SceneBuilder::new(&mut self.world);
                    Game::finish_dispatcher(
                        new.start(scene_builder)
                            .dispatcher()
                    )
                };
            }

            self.world.maintain();

            render.run_now(&mut self.world.res);

            self.world.write_resource::<FrameCount>().next();
            // TODO: a real delay??
            std::thread::sleep(std::time::Duration::from_millis(1000/60));
        }
        Ok(())
    }

    fn finish_dispatcher<'a, 'b>(dispatcher_builder: DispatcherBuilder<'a, 'b>) -> Dispatcher<'a, 'b> {
        dispatcher_builder
            .with_barrier()
            .with(EntityLifecycle::default(), "entity_lifecycle", &[])
            .build()
    }
}
