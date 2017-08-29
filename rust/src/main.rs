extern crate game_engine;

use game_engine::*;
use game_engine::types::Point;

struct Player {
    id: Identifier,
}
impl Actor for Player {
    fn id(&self) -> Identifier { self.id }
}
struct PlayerFactory;
impl ActorFactory<Player> for PlayerFactory {
    fn new(id: usize) -> Player {
        Player{
            id: Identifier{ id, class: 0 }
        }
    }
}

struct Eng;
impl Engine for Eng {
    fn start(&mut self, mut game: GameUtil) {
        game.spawn::<Player, PlayerFactory>();
    }
}

fn main() {
    let dimensions = Point(1024, 768);
    let engine = Eng;
    let game = Game::new(format!("Game Demo"), dimensions);
    game.run(engine);
}
