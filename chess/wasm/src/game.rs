use crate::{js_function::JsFunction, player::Player, state::GameState};

pub struct Game<'a> {
    state: GameState,

    player_white: Player,
    player_black: Player,
    set_state: JsFunction<'a, GameState>,
    set_message: JsFunction<'a, String>,
}

impl<'a> Game<'a> {
    /// Creates a new [`Game`].
    pub fn new(
        player_white: Player,
        player_black: Player,
        set_state: JsFunction<'a, GameState>,
        set_message: JsFunction<'a, String>,
    ) -> Self {
        Game {
            state: GameState::new(),

            player_white,
            player_black,
            set_state,
            set_message,
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
