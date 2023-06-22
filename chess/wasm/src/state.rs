pub mod board;
pub mod board_square;
pub mod castling;
pub mod en_passant;
pub mod mark;

use serde::Serialize;

use self::{board::Board, mark::Mark};

#[derive(Debug, Clone, Serialize)]
pub struct GameState {
    board: Board,

    message: String,
}

impl GameState {
    pub fn new(board: Board, message: String) -> GameState {
        GameState { board, message }
    }
}
