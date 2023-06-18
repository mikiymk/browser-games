use crate::{piece::Piece, ply::Ply, position::Position, state::Mark};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum BoardSquare {
    WhitePiece(Piece),
    BlackPiece(Piece),
    Empty,
}

impl BoardSquare {
    pub fn mark(&self) -> Option<Mark> {
        match self {
            BoardSquare::WhitePiece(_) => Some(Mark::White),
            BoardSquare::BlackPiece(_) => Some(Mark::Black),
            BoardSquare::Empty => None,
        }
    }

    pub fn piece(&self) -> Option<Piece> {
        match self {
            BoardSquare::WhitePiece(p) => Some(*p),
            BoardSquare::BlackPiece(p) => Some(*p),
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
            BoardSquare::WhitePiece(_) => BoardSquare::WhitePiece(piece),
            BoardSquare::BlackPiece(_) => BoardSquare::BlackPiece(piece),
            BoardSquare::Empty => BoardSquare::Empty,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Board {
    squares: [BoardSquare; 64],
}

impl Board {
    pub fn new() -> Board {
        Board {
            squares: [BoardSquare::Empty; 64],
        }
    }

    pub fn initial() -> Board {
        let mut board = Board::new();

        board.squares[0] = BoardSquare::BlackPiece(Piece::Rook);
        board.squares[1] = BoardSquare::BlackPiece(Piece::Knight);
        board.squares[2] = BoardSquare::BlackPiece(Piece::Bishop);
        board.squares[3] = BoardSquare::BlackPiece(Piece::Queen);
        board.squares[4] = BoardSquare::BlackPiece(Piece::King);
        board.squares[5] = BoardSquare::BlackPiece(Piece::Bishop);
        board.squares[6] = BoardSquare::BlackPiece(Piece::Knight);
        board.squares[7] = BoardSquare::BlackPiece(Piece::Rook);

        board.squares[8] = BoardSquare::BlackPiece(Piece::Pawn);
        board.squares[9] = BoardSquare::BlackPiece(Piece::Pawn);
        board.squares[10] = BoardSquare::BlackPiece(Piece::Pawn);
        board.squares[11] = BoardSquare::BlackPiece(Piece::Pawn);
        board.squares[12] = BoardSquare::BlackPiece(Piece::Pawn);
        board.squares[13] = BoardSquare::BlackPiece(Piece::Pawn);
        board.squares[14] = BoardSquare::BlackPiece(Piece::Pawn);
        board.squares[15] = BoardSquare::BlackPiece(Piece::Pawn);

        board.squares[48] = BoardSquare::WhitePiece(Piece::Pawn);
        board.squares[49] = BoardSquare::WhitePiece(Piece::Pawn);
        board.squares[50] = BoardSquare::WhitePiece(Piece::Pawn);
        board.squares[51] = BoardSquare::WhitePiece(Piece::Pawn);
        board.squares[52] = BoardSquare::WhitePiece(Piece::Pawn);
        board.squares[53] = BoardSquare::WhitePiece(Piece::Pawn);
        board.squares[54] = BoardSquare::WhitePiece(Piece::Pawn);
        board.squares[55] = BoardSquare::WhitePiece(Piece::Pawn);

        board.squares[56] = BoardSquare::WhitePiece(Piece::Rook);
        board.squares[57] = BoardSquare::WhitePiece(Piece::Knight);
        board.squares[58] = BoardSquare::WhitePiece(Piece::Bishop);
        board.squares[59] = BoardSquare::WhitePiece(Piece::Queen);
        board.squares[60] = BoardSquare::WhitePiece(Piece::King);
        board.squares[61] = BoardSquare::WhitePiece(Piece::Bishop);
        board.squares[62] = BoardSquare::WhitePiece(Piece::Knight);
        board.squares[63] = BoardSquare::WhitePiece(Piece::Rook);

        board
    }

    pub fn is_same_mark(&self, left: usize, right: usize) -> bool {
        self.squares[left].is_same_mark(&self.squares[right])
    }

    pub fn is_other_mark(&self, left: usize, right: usize) -> bool {
        self.squares[left].is_other_mark(&self.squares[right])
    }

    pub fn get_piece(&self, pos: Position) -> BoardSquare {
        self.squares[pos.index()]
    }

    fn move_piece(&mut self, from: Position, to: Position) {
        self.squares[to.index()] = self.squares[from.index()];
        self.squares[from.index()] = BoardSquare::Empty;
    }

    pub fn apply_ply(&self, ply: Ply) -> Board {
        match ply {
            Ply::Move { from, to } => {
                let mut clone = self.clone();

                clone.move_piece(from, to);

                clone
            }

            Ply::Castling(pos) => {
                let mut clone = self.clone();

                let (king_from, king_to, rook_from, rook_to) = pos.get_move_indexes();

                clone.move_piece(king_from, king_to);
                clone.move_piece(rook_from, rook_to);

                clone
            }

            Ply::EnPassant { from, to, capture } => {
                let mut clone = self.clone();

                clone.move_piece(from, to);
                clone.squares[capture.index()] = BoardSquare::Empty;

                clone
            }

            Ply::Promotion { from, to, piece } => {
                let mut clone = self.clone();

                clone.move_piece(from, to);
                let mut square = clone.squares[to.index()];
                square = square.promotion(piece);
                clone.squares[to.index()] = square;

                clone
            }
        }
    }
}
