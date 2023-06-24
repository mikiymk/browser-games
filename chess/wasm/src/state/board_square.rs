use std::fmt::Display;

use crate::state::piece::Piece;

use crate::state::Mark;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum BoardSquare {
    Piece(Mark, Piece),
    Empty,
}

impl BoardSquare {
    pub fn new(mark: Mark, piece: Piece) -> Self {
        BoardSquare::Piece(mark, piece)
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
