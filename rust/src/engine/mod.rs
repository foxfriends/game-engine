use piston_window::*;

pub mod types;
use self::types::Point;

pub struct Engine {
    pub dimensions: Point,
}

impl Engine {
    pub fn run(&self) {
        let mut window: PistonWindow = WindowSettings::new("Hello Piston!", [self.dimensions.0, self.dimensions.1])
            .exit_on_esc(true)
            .build()
            .unwrap();
        while let Some(event) = window.next() {
            window.draw_2d(&event, |context, graphics| { self.draw(context, graphics) });
        }
    }

    fn draw(&self, context: Context, graphics: &mut G2d) {
        clear([1.0; 4], graphics);
    }
}
