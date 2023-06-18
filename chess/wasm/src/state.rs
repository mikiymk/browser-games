pub mod board;
pub mod board_square;
pub mod castling;
pub mod en_passant;
pub mod mark;

use std::collections::HashMap;

use self::{board::Board, castling::Castling, mark::Mark};

#[derive(Debug, Clone)]
pub struct Game {
    board: Board,
    mark: Mark,
    castling: Castling,
    en_passant: Option<usize>,
    fifty_move: u32,
    threefold: HashMap<(Board, Mark), u8>,
    moves: u32,

    message: String,
}

impl Game {
    pub fn new() -> Game {
        Game {
            board: Board::initial(),
            mark: Mark::White,
            castling: Castling::new(),
            en_passant: None,
            fifty_move: 0,
            threefold: HashMap::new(),
            moves: 1,

            message: "".to_string(),
        }
    }
}
