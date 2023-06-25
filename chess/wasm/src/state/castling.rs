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
            CastlingType::BlackQueen => {
                (Position::B_K, Position::B_BQ, Position::B_RQ, Position::B_Q)
            }
            CastlingType::BlackKing => (
                Position::B_K,
                Position::B_NK,
                Position::B_RK,
                Position::B_BK,
            ),
            CastlingType::WhiteQueen => {
                (Position::W_K, Position::W_BQ, Position::W_RQ, Position::W_Q)
            }
            CastlingType::WhiteKing => (
                Position::W_K,
                Position::W_NK,
                Position::W_RK,
                Position::W_BK,
            ),
        }
    }
}

impl Display for CastlingType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let (king, _, rook, _) = self.get_move_indexes();

        write!(f, "{} {}", king, rook)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Castling(u8);
impl Castling {
    pub fn new(value: u8) -> Self {
        Self(value)
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

    pub fn as_u8(&self) -> u8 {
        self.0
    }

    pub fn apply_ply(&self, ply: &Ply) -> Castling {
        let mut clone = *self;

        match ply {
            Ply::Castling(CastlingType::BlackKing | CastlingType::BlackQueen)
            | Ply::Move {
                from: Position::B_K,
                ..
            }
            | Ply::Move {
                to: Position::B_K, ..
            } => {
                clone.set(CastlingType::BlackKing);
                clone.set(CastlingType::BlackQueen);
            }

            Ply::Castling(CastlingType::WhiteKing | CastlingType::WhiteQueen)
            | Ply::Move {
                from: Position::W_K,
                ..
            }
            | Ply::Move {
                to: Position::W_K, ..
            } => {
                clone.set(CastlingType::WhiteKing);
                clone.set(CastlingType::WhiteQueen);
            }

            Ply::Move {
                from: Position::B_RQ,
                ..
            }
            | Ply::Move {
                to: Position::B_RQ, ..
            } => {
                clone.set(CastlingType::BlackQueen);
            }

            Ply::Move {
                from: Position::B_RK,
                ..
            }
            | Ply::Move {
                to: Position::B_RK, ..
            } => {
                clone.set(CastlingType::BlackKing);
            }

            Ply::Move {
                from: Position::W_RQ,
                ..
            }
            | Ply::Move {
                to: Position::W_RQ, ..
            } => {
                clone.set(CastlingType::WhiteQueen);
            }

            Ply::Move {
                from: Position::W_RK,
                ..
            }
            | Ply::Move {
                to: Position::W_RK, ..
            } => {
                clone.set(CastlingType::WhiteKing);
            }
            _ => (),
        }

        clone
    }
}
