use std::usize;
use std::cell::RefCell;
use std::rc::Rc;
use super::super::Game;
use super::super::actor::{Actor,ActorFactory};

static mut ACTOR_ID: usize = 0;

pub struct GameUtil<'a> {
    game: &'a mut Game,
}

impl<'a> GameUtil<'a> {
    pub fn new(game: &'a mut Game) -> Self {
        Self{ game }
    }

    pub fn spawn<A: Actor + 'static, T: ActorFactory<A>>(&mut self) {
        unsafe { // TODO: is there a better way to do this?
            ACTOR_ID = (ACTOR_ID + 1) % usize::MAX;
            self.game.actors.push(Rc::new(RefCell::new(Box::new(T::new(ACTOR_ID)))))
        }
    }
}
