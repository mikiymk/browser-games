use std::collections::HashMap;

use crate::{
    js_function::JsFunction,
    player::Player,
    state::{board::Board, castling::Castling, en_passant::EnPassant, mark::Mark, GameState},
};

pub struct Game<'a> {
    board: Board,
    mark: Mark,
    castling: Castling,
    en_passant: EnPassant,
    fifty_move: u32,
    threefold: HashMap<(Board, Mark), u8>,
    moves: u32,
    message: String,

    player_white: Player,
    player_black: Player,
    set_state: JsFunction<'a, GameState>,
}

impl<'a> Game<'a> {
    /// Creates a new [`Game`].
    pub fn new(
        player_white: Player,
        player_black: Player,
        set_state: JsFunction<'a, GameState>,
    ) -> Self {
        Game {
            board: Board::initial(),
            mark: Mark::White,
            castling: Castling::new(),
            en_passant: EnPassant::new(),
            fifty_move: 0,
            threefold: HashMap::new(),
            moves: 1,

            message: "".to_string(),

            player_white,
            player_black,
            set_state,
        }
    }

    pub fn run(&mut self) -> Result<(), String> {
        self.initialize();

        loop {
            self.ply()?;

            if self.is_finished() {
                break;
            }
        }

        Ok(())
    }

    fn initialize(&mut self) {
        todo!()
    }

    fn ply(&mut self) -> Result<(), String> {
        self.set_state
            .call(GameState::new(self.board.clone(), self.message.clone()))?;

        let player = match self.mark {
            Mark::White => &self.player_white,
            Mark::Black => &self.player_black,
        };
        todo!()
    }

    fn is_finished(&mut self) -> bool {
        todo!()
    }
}
