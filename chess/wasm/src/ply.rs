use crate::{piece::Piece, state::CastlingType, position::Position};

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
}
