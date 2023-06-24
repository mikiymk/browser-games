use std::fmt::Display;

use crate::{state::ply::Ply, state::position::Position};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum CastlingType {
    BlackQueen,
    BlackKing,
    WhiteQueen,
    WhiteKing,
}

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
            CastlingType::BlackQueen => (
                Position::new(0, 4),
                Position::new(0, 2),
                Position::new(0, 0),
                Position::new(0, 3),
            ),
            CastlingType::BlackKing => (
                Position::new(0, 4),
                Position::new(0, 6),
                Position::new(0, 7),
                Position::new(0, 5),
            ),
            CastlingType::WhiteQueen => (
                Position::new(7, 4),
                Position::new(7, 2),
                Position::new(7, 0),
                Position::new(7, 3),
            ),
            CastlingType::WhiteKing => (
                Position::new(7, 4),
                Position::new(7, 6),
                Position::new(7, 7),
                Position::new(7, 5),
            ),
        }
    }
}

impl Display for CastlingType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let (king, rook) = match self {
            CastlingType::BlackQueen => (Position::new(0, 4), Position::new(0, 0)),
            CastlingType::BlackKing => (Position::new(0, 4), Position::new(0, 7)),
            CastlingType::WhiteQueen => (Position::new(7, 4), Position::new(7, 0)),
            CastlingType::WhiteKing => (Position::new(7, 4), Position::new(7, 7)),
        };

        write!(f, "{} <=> {}", king, rook)
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
            CastlingType::BlackKing => self.0 |= 0b1000,
            CastlingType::BlackQueen => self.0 |= 0b0100,
            CastlingType::WhiteKing => self.0 |= 0b0010,
            CastlingType::WhiteQueen => self.0 |= 0b0001,
        }
    }

    pub fn get(&self, pos: CastlingType) -> bool {
        match pos {
            CastlingType::BlackKing => self.0 & 0b1000 != 0,
            CastlingType::BlackQueen => self.0 & 0b0100 != 0,
            CastlingType::WhiteKing => self.0 & 0b0010 != 0,
            CastlingType::WhiteQueen => self.0 & 0b0001 != 0,
        }
    }

    pub fn apply_ply(&self, ply: &Ply) -> Castling {
        let mut clone = *self;

        match ply {
            Ply::Castling(CastlingType::BlackKing | CastlingType::BlackQueen)
            | Ply::Move {
                from: Position::BLACK_KING,
                ..
            }
            | Ply::Move {
                to: Position::BLACK_KING,
                ..
            } => {
                clone.set(CastlingType::BlackKing);
                clone.set(CastlingType::BlackQueen);
            }

            Ply::Castling(CastlingType::WhiteKing | CastlingType::WhiteQueen)
            | Ply::Move {
                from: Position::WHITE_KING,
                ..
            }
            | Ply::Move {
                to: Position::WHITE_KING,
                ..
            } => {
                clone.set(CastlingType::WhiteKing);
                clone.set(CastlingType::WhiteQueen);
            }

            Ply::Move {
                from: Position::BLACK_ROOK_QUEEN_SIDE,
                ..
            }
            | Ply::Move {
                to: Position::BLACK_ROOK_QUEEN_SIDE,
                ..
            } => {
                clone.set(CastlingType::BlackQueen);
            }

            Ply::Move {
                from: Position::BLACK_ROOK_KING_SIDE,
                ..
            }
            | Ply::Move {
                to: Position::BLACK_ROOK_KING_SIDE,
                ..
            } => {
                clone.set(CastlingType::BlackKing);
            }

            Ply::Move {
                from: Position::WHITE_ROOK_QUEEN_SIDE,
                ..
            }
            | Ply::Move {
                to: Position::WHITE_ROOK_QUEEN_SIDE,
                ..
            } => {
                clone.set(CastlingType::WhiteQueen);
            }

            Ply::Move {
                from: Position::WHITE_ROOK_KING_SIDE,
                ..
            }
            | Ply::Move {
                to: Position::WHITE_ROOK_KING_SIDE,
                ..
            } => {
                clone.set(CastlingType::WhiteKing);
            }
            _ => (),
        }

        clone
    }
}
