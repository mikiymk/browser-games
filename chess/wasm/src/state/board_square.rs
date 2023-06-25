use std::fmt::Display;

use crate::state::piece::Piece;

use crate::state::Mark;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum BoardSquare {
    Piece(Mark, Piece),
    Empty,
}

impl BoardSquare {
    pub const fn new(mark: Mark, piece: Piece) -> Self {
        BoardSquare::Piece(mark, piece)
    }

    pub fn try_from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(Self::Empty),
            1 => Some(Self::new(Mark::White, Piece::Pawn)),
            2 => Some(Self::new(Mark::White, Piece::Knight)),
            3 => Some(Self::new(Mark::White, Piece::Bishop)),
            4 => Some(Self::new(Mark::White, Piece::Rook)),
            5 => Some(Self::new(Mark::White, Piece::Queen)),
            6 => Some(Self::new(Mark::White, Piece::King)),
            7 => Some(Self::new(Mark::Black, Piece::Pawn)),
            8 => Some(Self::new(Mark::Black, Piece::Knight)),
            9 => Some(Self::new(Mark::Black, Piece::Bishop)),
            10 => Some(Self::new(Mark::Black, Piece::Rook)),
            11 => Some(Self::new(Mark::Black, Piece::Queen)),
            12 => Some(Self::new(Mark::Black, Piece::King)),

            _ => None,
        }
    }

    pub fn mark(&self) -> Option<Mark> {
        match self {
            BoardSquare::Piece(m, _) => Some(*m),
            BoardSquare::Empty => None,
        }
    }

    pub fn piece(&self) -> Option<Piece> {
        match self {
            BoardSquare::Piece(_, p) => Some(*p),
            BoardSquare::Empty => None,
        }
    }

    pub fn is_empty(&self) -> bool {
        matches!(self, BoardSquare::Empty)
    }

    pub fn is_same_mark(&self, other: &BoardSquare) -> bool {
        match (self.mark(), other.mark()) {
            (None, _) | (_, None) => false,
            (Some(l), Some(r)) => l == r,
        }
    }

    pub fn is_other_mark(&self, other: &BoardSquare) -> bool {
        match (self.mark(), other.mark()) {
            (None, _) | (_, None) => false,
            (Some(l), Some(r)) => l != r,
        }
    }

    pub fn promotion(&self, piece: Piece) -> BoardSquare {
        match self {
            BoardSquare::Piece(m, _) => BoardSquare::Piece(*m, piece),
            BoardSquare::Empty => BoardSquare::Empty,
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

impl Display for BoardSquare {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                BoardSquare::Piece(Mark::White, Piece::Pawn) => 'P',
                BoardSquare::Piece(Mark::White, Piece::Knight) => 'N',
                BoardSquare::Piece(Mark::White, Piece::Bishop) => 'B',
                BoardSquare::Piece(Mark::White, Piece::Rook) => 'R',
                BoardSquare::Piece(Mark::White, Piece::Queen) => 'Q',
                BoardSquare::Piece(Mark::White, Piece::King) => 'K',
                BoardSquare::Piece(Mark::Black, Piece::Pawn) => 'p',
                BoardSquare::Piece(Mark::Black, Piece::Knight) => 'n',
                BoardSquare::Piece(Mark::Black, Piece::Bishop) => 'b',
                BoardSquare::Piece(Mark::Black, Piece::Rook) => 'r',
                BoardSquare::Piece(Mark::Black, Piece::Queen) => 'q',
                BoardSquare::Piece(Mark::Black, Piece::King) => 'k',
                BoardSquare::Empty => ' ',
            }
        )
    }
}
