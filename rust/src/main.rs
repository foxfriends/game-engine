extern crate game_engine;

use game_engine::{Game,Engine};
use game_engine::types::Point;

struct Eng;
impl Engine for Eng {}

fn main() {
    let dimensions = Point(1024, 768);
    let engine = Eng;
    let game = Game::new(format!("Game Demo"), dimensions);
    game.run(engine);
}
