use std::fmt::Display;

use crate::state::piece::Piece;

use crate::state::mark::Mark;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Square {
    Piece(Mark, Piece),
    Empty,
}

impl Square {
    pub const WHITE_PAWN: Self = Self::new(Mark::White, Piece::Pawn);
    pub const WHITE_KNIGHT: Self = Self::new(Mark::White, Piece::Knight);
    pub const WHITE_BISHOP: Self = Self::new(Mark::White, Piece::Bishop);
    pub const WHITE_ROOK: Self = Self::new(Mark::White, Piece::Rook);
    pub const WHITE_QUEEN: Self = Self::new(Mark::White, Piece::Queen);
    pub const WHITE_KING: Self = Self::new(Mark::White, Piece::King);

    pub const BLACK_PAWN: Self = Self::new(Mark::Black, Piece::Pawn);
    pub const BLACK_KNIGHT: Self = Self::new(Mark::Black, Piece::Knight);
    pub const BLACK_BISHOP: Self = Self::new(Mark::Black, Piece::Bishop);
    pub const BLACK_ROOK: Self = Self::new(Mark::Black, Piece::Rook);
    pub const BLACK_QUEEN: Self = Self::new(Mark::Black, Piece::Queen);
    pub const BLACK_KING: Self = Self::new(Mark::Black, Piece::King);

    pub const fn new(mark: Mark, piece: Piece) -> Self {
        Self::Piece(mark, piece)
    }

    pub fn try_from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(Self::Empty),
            1 => Some(Self::WHITE_PAWN),
            2 => Some(Self::WHITE_KNIGHT),
            3 => Some(Self::WHITE_BISHOP),
            4 => Some(Self::WHITE_ROOK),
            5 => Some(Self::WHITE_QUEEN),
            6 => Some(Self::WHITE_KING),
            7 => Some(Self::BLACK_PAWN),
            8 => Some(Self::BLACK_KNIGHT),
            9 => Some(Self::BLACK_BISHOP),
            10 => Some(Self::BLACK_ROOK),
            11 => Some(Self::BLACK_QUEEN),
            12 => Some(Self::BLACK_KING),

            _ => None,
        }
    }

    pub fn mark(&self) -> Option<Mark> {
        match self {
            Self::Piece(m, _) => Some(*m),
            Self::Empty => None,
        }
    }

    pub fn is_empty(&self) -> bool {
        matches!(self, Self::Empty)
    }

    pub fn is_same_mark(&self, other: &Self) -> bool {
        match (self.mark(), other.mark()) {
            (None, _) | (_, None) => false,
            (Some(l), Some(r)) => l == r,
        }
    }

    pub fn is_other_mark(&self, other: &Self) -> bool {
        match (self.mark(), other.mark()) {
            (None, _) | (_, None) => false,
            (Some(l), Some(r)) => l != r,
        }
    }

    pub fn promotion(&self, piece: Piece) -> Self {
        match self {
            Self::Piece(m, _) => Self::Piece(*m, piece),
            Self::Empty => Self::Empty,
        }
    }

    pub fn as_u8(&self) -> u8 {
        match self {
            Self::Empty => 0,
            Self::Piece(Mark::White, Piece::Pawn) => 1,
            Self::Piece(Mark::White, Piece::Knight) => 2,
            Self::Piece(Mark::White, Piece::Bishop) => 3,
            Self::Piece(Mark::White, Piece::Rook) => 4,
            Self::Piece(Mark::White, Piece::Queen) => 5,
            Self::Piece(Mark::White, Piece::King) => 6,
            Self::Piece(Mark::Black, Piece::Pawn) => 7,
            Self::Piece(Mark::Black, Piece::Knight) => 8,
            Self::Piece(Mark::Black, Piece::Bishop) => 9,
            Self::Piece(Mark::Black, Piece::Rook) => 10,
            Self::Piece(Mark::Black, Piece::Queen) => 11,
            Self::Piece(Mark::Black, Piece::King) => 12,
        }
    }
}

impl Display for Square {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Self::Piece(Mark::White, Piece::Pawn) => 'P',
                Self::Piece(Mark::White, Piece::Knight) => 'N',
                Self::Piece(Mark::White, Piece::Bishop) => 'B',
                Self::Piece(Mark::White, Piece::Rook) => 'R',
                Self::Piece(Mark::White, Piece::Queen) => 'Q',
                Self::Piece(Mark::White, Piece::King) => 'K',
                Self::Piece(Mark::Black, Piece::Pawn) => 'p',
                Self::Piece(Mark::Black, Piece::Knight) => 'n',
                Self::Piece(Mark::Black, Piece::Bishop) => 'b',
                Self::Piece(Mark::Black, Piece::Rook) => 'r',
                Self::Piece(Mark::Black, Piece::Queen) => 'q',
                Self::Piece(Mark::Black, Piece::King) => 'k',
                Self::Empty => ' ',
            }
        )
    }
}
