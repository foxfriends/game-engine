use super::super::Game;
pub struct GameUtil<'a> {
    game: &'a mut Game,
}

impl<'a> GameUtil<'a> {
    pub fn new(game: &'a mut Game) -> Self {
        Self{ game }
    }
}
