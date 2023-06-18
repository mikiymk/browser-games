use std::collections::HashMap;

use crate::{board::Board, ply::Ply, position::Position};

#[derive(Debug, Clone)]
pub struct Game {
    board: Board,
    mark: Mark,
    castling: Castling,
    enPassant: Option<usize>,
    fiftyMove: u32,
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
            enPassant: None,
            fiftyMove: 0,
            threefold: HashMap::new(),
            moves: 1,

            message: "".to_string(),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Mark {
    White,
    Black,
}

impl Mark {
    pub fn invert(&self) -> Mark {
        use Mark::{Black, White};

        match self {
            White => Black,
            Black => White,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum CastlingType {
    BlackQueenSide,
    BlackKingSide,
    WhiteQueenSide,
    WhiteKingSide,
}

const BLACK_QUEEN_SIDE_INITIAL_INDEX: usize = 0;
const BLACK_KING_SIDE_INITIAL_INDEX: usize = 7;
const WHITE_QUEEN_SIDE_INITIAL_INDEX: usize = 56;
const WHITE_KING_SIDE_INITIAL_INDEX: usize = 63;

impl CastlingType {
    pub fn get_move_indexes(
        &self,
    ) -> (
        Position, // king from
        Position, // king to
        Position, // rook from
        Position, // rook to
    ) {
        match self {
            CastlingType::BlackQueenSide => (
                Position::new(0, 4),
                Position::new(0, 2),
                Position::new(0, 0),
                Position::new(0, 3),
            ),
            CastlingType::BlackKingSide => (
                Position::new(0, 4),
                Position::new(0, 6),
                Position::new(0, 7),
                Position::new(0, 5),
            ),
            CastlingType::WhiteQueenSide => (
                Position::new(7, 4),
                Position::new(7, 2),
                Position::new(7, 0),
                Position::new(7, 3),
            ),
            CastlingType::WhiteKingSide => (
                Position::new(7, 4),
                Position::new(7, 6),
                Position::new(7, 7),
                Position::new(7, 5),
            ),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Castling(u8);
impl Castling {
    pub fn new() -> Castling {
        Castling(0)
    }

    pub fn set(&mut self, pos: CastlingType) {
        match pos {
            CastlingType::BlackKingSide => self.0 |= 0b1000,
            CastlingType::BlackQueenSide => self.0 |= 0b0100,
            CastlingType::WhiteKingSide => self.0 |= 0b0010,
            CastlingType::WhiteQueenSide => self.0 |= 0b0001,
        }
    }

    pub fn get(&self, pos: CastlingType) -> bool {
        match pos {
            CastlingType::BlackKingSide => self.0 | 0b1000 != 0,
            CastlingType::BlackQueenSide => self.0 | 0b0100 != 0,
            CastlingType::WhiteKingSide => self.0 | 0b0010 != 0,
            CastlingType::WhiteQueenSide => self.0 | 0b0001 != 0,
        }
    }

    pub fn apply_ply(&self, ply: Ply) -> Castling {
        let mut clone = self.clone();

        match ply {
            Ply::Castling(CastlingType::BlackKingSide | CastlingType::BlackQueenSide)
            | Ply::Move {
                from: Position::BLACK_KING,
                ..
            }
            | Ply::Move {
                to: Position::BLACK_KING,
                ..
            } => {
                clone.set(CastlingType::BlackKingSide);
                clone.set(CastlingType::BlackQueenSide);
            }

            Ply::Castling(CastlingType::WhiteKingSide | CastlingType::WhiteQueenSide)
            | Ply::Move {
                from: Position::WHITE_KING,
                ..
            }
            | Ply::Move {
                to: Position::WHITE_KING,
                ..
            } => {
                clone.set(CastlingType::WhiteKingSide);
                clone.set(CastlingType::WhiteQueenSide);
            }

            Ply::Move {
                from: Position::BLACK_ROOK_QUEEN_SIDE,
                ..
            }
            | Ply::Move {
                to: Position::BLACK_ROOK_QUEEN_SIDE,
                ..
            } => {
                clone.set(CastlingType::BlackQueenSide);
            }

            Ply::Move {
                from: Position::BLACK_ROOK_KING_SIDE,
                ..
            }
            | Ply::Move {
                to: Position::BLACK_ROOK_KING_SIDE,
                ..
            } => {
                clone.set(CastlingType::BlackKingSide);
            }

            Ply::Move {
                from: Position::WHITE_ROOK_QUEEN_SIDE,
                ..
            }
            | Ply::Move {
                to: Position::WHITE_ROOK_QUEEN_SIDE,
                ..
            } => {
                clone.set(CastlingType::WhiteQueenSide);
            }

            Ply::Move {
                from: Position::WHITE_ROOK_KING_SIDE,
                ..
            }
            | Ply::Move {
                to: Position::WHITE_ROOK_KING_SIDE,
                ..
            } => {
                clone.set(CastlingType::WhiteKingSide);
            }
            _ => (),
        }

        clone
    }
}
