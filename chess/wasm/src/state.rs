pub mod board;
pub mod board_square;
pub mod castling;
pub mod en_passant;
pub mod mark;
pub mod piece;
pub mod ply;
pub mod position;

use serde::Serialize;

use self::{board::Board, mark::Mark};

#[derive(Debug, Clone, Serialize)]
pub struct GameState {
    board: Board,

    message: &'static str,
}

impl GameState {
    pub fn new(board: Board, message: &'static str) -> GameState {
        GameState { board, message }
    }
}
