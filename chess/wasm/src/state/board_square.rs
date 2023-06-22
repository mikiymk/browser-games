use serde::{Deserialize, Serialize};

use crate::piece::Piece;

use crate::state::Mark;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
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
