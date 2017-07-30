extern crate game_engine;

use game_engine::engine::Engine;
use game_engine::engine::types::Point;

fn main() {
    let dimensions = Point(1024, 768);
    let engine = Engine { dimensions };
    engine.run();
}
