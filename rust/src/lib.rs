//! A game engine!

#![warn(missing_docs)]
#![deny(bare_trait_objects)]
#![feature(const_fn, macro_at_most_once_rep)]

extern crate sdl2;
extern crate specs;
extern crate shred;
extern crate serde;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate specs_derive;
#[macro_use] extern crate shred_derive;

use std::fs::{create_dir_all, remove_dir_all};

use specs::prelude::*;
use sdl2::event::Event;
use shred::Resource;

#[cfg(feature = "perf")]
use std::time::Instant;

macro_rules! tiles_dir {
    () => ({
        let mut path = ::std::env::current_exe().unwrap();
        path.pop();
        path.push("tmp/tiles");
        path
    })
}

mod error;
pub mod model;
#[macro_use] pub mod util;
pub mod camera;
pub mod common;
pub mod loading;
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
use camera::Camera;
use input::text::{TextInput, TextInputEvents, TextInputEvent};
use input::keyboard::{KeyboardEvents, KeyboardEvent, KeyboardState};
use input::mouse::{MouseEvents, MouseEvent, MouseButton, MouseState};
use loading::IsLoading;
use visuals::{Visuals, Drawable, TileLayers};
use common::{Create, Delete, SceneMember};
use timing::{FrameCount, RunTime};
use lifecycle::EntityLifecycle;
use scene::{CurrentScene, Scene, SceneBuilder};
use model::shape::*;

/// A game builder, which can be [`start`](Game::start)ed once everything is set up.
///
/// Note: Highly coupled to [`specs`]... Not sure if that's avoidable or not without implementing the
/// entire ECS system again, but this is probably ok...
pub struct Game {
    world: World,
    size: Dimen,
    title: &'static str,
    plugins: Vec<Box<dyn Fn(&mut World)>>,
}

impl Game {
    /// Creates a new game builder
    pub fn new() -> Self {
        let mut world = World::new();

        world.register::<Box<dyn Drawable>>();
        world.register::<Create>();
        world.register::<Delete>();
        world.register::<SceneMember>();

        Game {
            world,
            size: Dimen::new(1024, 768),
            title: "",
            plugins: vec![],
        }
    }

    /// Sets the window title
    pub fn titled(self, title: &'static str) -> Self {
        Self {
            title,
            ..self
        }
    }

    /// Sets the initial size of the window
    pub fn set_size(self, width: u32, height: u32) -> Self {
        Self {
            size: Dimen::new(width, height),
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

    /// Pipes this game through another function. Helps when setting up a complex game while
    /// keeping a purely functional looking interface.
    pub fn pipe(self, op: impl Fn(Self) -> Self) -> Self {
        op(self)
    }

    /// Adds a plugin to the system. Plugins are run once before each step, and can do anything
    /// they need to do to the world
    pub fn plugin(mut self, plugin: impl Fn(&mut World) + 'static) -> Self {
        self.plugins.push(Box::new(plugin));
        self
    }

    /// Starts the game
    pub fn start<'a, 'b>(mut self, scene: &'static dyn Scene) -> ::Result<()> {
        // Set up the environment
        create_dir_all(tiles_dir!())?;

        // Set up SDL
        let sdl_context = sdl2::init()?;
        let _image_context = sdl2::image::init(sdl2::image::INIT_PNG)?;
        let ttf_context = sdl2::ttf::init()?;
        let video = sdl_context.video()?;

        let window = video.window(self.title, self.size.width, self.size.height)
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
        self.world.add_resource(TileLayers::default());
        self.world.add_resource(Camera::new(
            Rect::from(Point::new(0, 0), self.size),
            Rect::from(Point::new(0, 0), self.size),
        ));
        self.world.add_resource(IsLoading::default());

        // Finalize the systems
        let mut render = Visuals::new(self.size, canvas, &ttf_context);

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
            #[cfg(feature = "perf")] let frame_start = Instant::now();
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

            #[cfg(feature = "perf")] let before_plugins = Instant::now();
            #[cfg(feature = "perf")] eprintln!("[ENGINE] Time to process events {:?}", frame_start.elapsed());

            // Do the things
            for plugin in &self.plugins {
                plugin(&mut self.world)
            }

            #[cfg(feature = "perf")] let before_dispatch = Instant::now();
            #[cfg(feature = "perf")] eprintln!("[ENGINE] Time to handle plugins {:?}", before_dispatch.duration_since(before_plugins));

            dispatcher.dispatch(&mut self.world.res);
            if **self.world.read_resource::<Quit>() {
                break;
            }

            #[cfg(feature = "perf")] let after_dispatch = Instant::now();
            #[cfg(feature = "perf")] eprintln!("[ENGINE] Time to handle main dispatch {:?}", after_dispatch.duration_since(before_dispatch));

            self.world.read_resource::<TextInput>()
                .sync_to(&text_input);

            let transition = self.world.write_resource::<CurrentScene>().transition();
            if let Some((old, new)) = transition {
                old.end(SceneBuilder::new(&mut self.world));
                self.world.maintain();
                dispatcher = {
                    let scene_builder = SceneBuilder::new(&mut self.world);
                    Game::finish_dispatcher(
                        new.start(scene_builder)
                            .dispatcher()
                    )
                };
            }

            self.world.maintain();

            #[cfg(feature = "perf")] let before_render = Instant::now();

            render.run_now(&mut self.world.res);

            #[cfg(feature = "perf")] let after_render = Instant::now();
            #[cfg(feature = "perf")] eprintln!("[ENGINE] Time to render {:?}", after_render.duration_since(before_render));

            self.world.write_resource::<FrameCount>().next();
            // TODO: a real delay??
            std::thread::sleep(std::time::Duration::from_millis(1000/60));
        }
        remove_dir_all(tiles_dir!())?;
        Ok(())
    }

    fn finish_dispatcher<'a, 'b>(dispatcher_builder: DispatcherBuilder<'a, 'b>) -> Dispatcher<'a, 'b> {
        dispatcher_builder
            .with_barrier()
            .with(EntityLifecycle::default(), "entity_lifecycle", &[])
            .build()
    }
}

pub mod prelude {
    //! All the useful things you might probably need!

    pub use super::{
        camera::Camera,
        common::{Create, Delete, SceneMember},
        visuals::{
            Drawable,
            Canvas,
            Image,
            Tile,
            TileSet,
            TileLayers,
            TileGrid,
            Sprite,
            Font,
            Color,
        },
        quit::Quit,
        input::{
            mouse::{
                MouseState,
                MouseEvents,
                MouseEvent,
                MouseButton,
            },
            keyboard::{
                KeyboardState,
                KeyboardEvents,
                KeyboardEvent,
                Key,
            },
            text::{
                TextInput,
                TextInputEvents,
                TextInputEvent,
            },
        },
        model::shape::{Rect, Dimen, Point},
        timing::{FrameCount, RunTime},
        scene::{CurrentScene, Scene, SceneManager, SceneBuilder},
        util::entity_factory::EntityFactory,
        loading::IsLoading,
        Game,
        sdl2::ttf::GlyphMetrics,
    };
    pub use specs::prelude::*;
}
