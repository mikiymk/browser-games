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

    pub fn try_from_str(value: &str) -> Option<Self> {
        let mut iter = value.split_ascii_whitespace();

        match iter.next() {
            Some("m") => {
                let from = Position::try_from_str(iter.next()?)?;
                let to = Position::try_from_str(iter.next()?)?;

                Some(Self::new_move(from, to))
            }
            Some("c") => {
                let from = Position::try_from_str(iter.next()?)?;
                let to = Position::try_from_str(iter.next()?)?;

                let castling_type = match (from, to) {
                    (Position::W_K, Position::W_RK) => CastlingType::WhiteKing,
                    (Position::W_K, Position::WHITE_ROOK_QUEENSIDE) => CastlingType::WhiteQueen,
                    (Position::B_K, Position::B_RK) => CastlingType::BlackKing,
                    (Position::B_K, Position::B_RQ) => CastlingType::BlackQueen,
                    _ => return None,
                };

                Some(Self::new_castling(castling_type))
            }
            Some("e") => {
                let from = Position::try_from_str(iter.next()?)?;
                let to = Position::try_from_str(iter.next()?)?;
                let capture = Position::try_from_str(iter.next()?)?;

                Some(Self::new_en_passant(from, to, capture))
            }
            Some("p") => {
                let from = Position::try_from_str(iter.next()?)?;
                let to = Position::try_from_str(iter.next()?)?;
                let piece = Piece::try_from_str(iter.next()?)?;

                Some(Self::new_promotion(from, to, piece))
            }
            _ => None,
        }
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
            Ply::Move { from, to } => write!(f, "m {} {}", from, to),
            Ply::Castling(ty) => write!(f, "c {}", ty),
            Ply::EnPassant { from, to, capture } => write!(f, "e {} {} {}", from, to, capture),
            Ply::Promotion { from, to, piece } => write!(f, "p {} {} {}", from, to, piece),
        }
    }
}
