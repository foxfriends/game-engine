macro_rules! util { ($me:ident) => ( GameUtil::new(&mut $me) ) }

use piston_window::*;

pub mod actor;
pub mod types;
pub mod util;

use self::types::Point;
use self::actor::Actor;
use self::util::*;

pub struct Game {
    title: String,
    dimensions: Point,
    actors: Vec<Box<Actor>>,
}

impl Game {
    pub fn new(title: String, dimensions: Point) -> Self {
        Self{
            title,
            dimensions,
            actors: vec![],
        }
    }

    pub fn run<T: Engine>(mut self, mut engine: T) {
        let mut window: PistonWindow = WindowSettings::new(self.title.clone(), [self.dimensions.0, self.dimensions.1])
            .exit_on_esc(true)
            .build().unwrap();
        engine.start(util!(self));
        while let Some(event) = window.next() {
            self.actors = self.actors.into_iter().map(|actor| actor).collect();
            window.draw_2d(&event, |context, graphics| { self.draw(context, graphics) });
        }
        engine.end(util!(self));
    }

    fn draw(&self, _context: Context, graphics: &mut G2d) {
        clear([1.0; 4], graphics);
    }
}

#[allow(unused)]
pub trait Engine {
    fn start(&mut self, util: GameUtil) where Self: Sized {}
    fn update(&mut self, util: GameUtil) where Self: Sized {}
    fn end(&mut self, util: GameUtil) where Self: Sized {}
}
