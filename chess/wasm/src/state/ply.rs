use std::fmt::Display;

use crate::{state::castling::CastlingType, state::piece::Piece, state::position::Position};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Ply {
    Move {
        from: Position,
        to: Position,
    },

    Castling(CastlingType),

    EnPassant {
        from: Position,
        to: Position,
        capture: Position,
    },

    Promotion {
        from: Position,
        to: Position,
        piece: Piece,
    },
}

impl Ply {
    pub fn new_move(from: Position, to: Position) -> Ply {
        Ply::Move { from, to }
    }

    pub fn new_castling(position: CastlingType) -> Ply {
        Ply::Castling(position)
    }

    pub fn new_en_passant(from: Position, to: Position, capture: Position) -> Ply {
        Ply::EnPassant { from, to, capture }
    }

    pub fn new_promotion(from: Position, to: Position, piece: Piece) -> Ply {
        Ply::Promotion { from, to, piece }
    }

    pub fn move_to_promotion(&self, piece: &Piece) -> Ply {
        match self {
            Ply::Move { from, to } => Ply::new_promotion(*from, *to, *piece),
            ply => *ply,
        }
    }
}

impl Display for Ply {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Ply::Move { from, to } => write!(f, "{} => {}", from, to),
            Ply::Castling(ty) => write!(f, "{}", ty),
            Ply::EnPassant { from, to, capture } => write!(f, "{} => {} cap {}", from, to, capture),
            Ply::Promotion { from, to, piece } => write!(f, "{} => {} * {}", from, to, piece),
        }
    }
}
