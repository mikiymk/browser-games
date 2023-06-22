use crate::state::GameState;

pub struct Game {
    state: GameState,
}

impl Game {
    pub fn new() -> Self {
        Game {
            state: GameState::new(),
        }
    }

    pub fn run(&mut self) {
        self.initialize();

        loop {
            self.ply();

            if self.is_finished() {
                break;
            }
        }
    }

    fn initialize(&mut self) {
        todo!()
    }

    fn ply(&mut self) {
        todo!()
    }

    fn is_finished(&mut self) -> bool {
        todo!()
    }
}
