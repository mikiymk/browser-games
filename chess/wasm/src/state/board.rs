use std::fmt::Display;

use serde::{ser::SerializeSeq, Serialize};

use crate::{state::mark::Mark, state::piece::Piece, state::ply::Ply, state::position::Position};

use super::board_square::BoardSquare;

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

    pub fn try_from_slice(value: &[u8]) -> Option<Board> {
        let mut squares = [BoardSquare::Empty; 64];

        for (i, value) in value.iter().enumerate() {
            if i >= 64 {
                break;
            }

            squares[i] = BoardSquare::try_from_u8(*value)?;
        }

        Some(Board { squares })
    }

    pub fn initial() -> Board {
        use Mark::{Black, White};
        use Piece::{Bishop, King, Knight, Pawn, Queen, Rook};

        let mut board = Board::new();

        board.squares[0] = BoardSquare::new(Black, Rook);
        board.squares[1] = BoardSquare::new(Black, Knight);
        board.squares[2] = BoardSquare::new(Black, Bishop);
        board.squares[3] = BoardSquare::new(Black, Queen);
        board.squares[4] = BoardSquare::new(Black, King);
        board.squares[5] = BoardSquare::new(Black, Bishop);
        board.squares[6] = BoardSquare::new(Black, Knight);
        board.squares[7] = BoardSquare::new(Black, Rook);
        board.squares[8] = BoardSquare::new(Black, Pawn);
        board.squares[9] = BoardSquare::new(Black, Pawn);
        board.squares[10] = BoardSquare::new(Black, Pawn);
        board.squares[11] = BoardSquare::new(Black, Pawn);
        board.squares[12] = BoardSquare::new(Black, Pawn);
        board.squares[13] = BoardSquare::new(Black, Pawn);
        board.squares[14] = BoardSquare::new(Black, Pawn);
        board.squares[15] = BoardSquare::new(Black, Pawn);
        board.squares[48] = BoardSquare::new(White, Pawn);
        board.squares[49] = BoardSquare::new(White, Pawn);
        board.squares[50] = BoardSquare::new(White, Pawn);
        board.squares[51] = BoardSquare::new(White, Pawn);
        board.squares[52] = BoardSquare::new(White, Pawn);
        board.squares[53] = BoardSquare::new(White, Pawn);
        board.squares[54] = BoardSquare::new(White, Pawn);
        board.squares[55] = BoardSquare::new(White, Pawn);
        board.squares[56] = BoardSquare::new(White, Rook);
        board.squares[57] = BoardSquare::new(White, Knight);
        board.squares[58] = BoardSquare::new(White, Bishop);
        board.squares[59] = BoardSquare::new(White, Queen);
        board.squares[60] = BoardSquare::new(White, King);
        board.squares[61] = BoardSquare::new(White, Bishop);
        board.squares[62] = BoardSquare::new(White, Knight);
        board.squares[63] = BoardSquare::new(White, Rook);

        board
    }

    pub fn is_same_mark(&self, left: &Position, right: &Position) -> bool {
        self.get_piece(left).is_same_mark(&self.get_piece(right))
    }

    pub fn is_other_mark(&self, left: &Position, right: &Position) -> bool {
        self.get_piece(left).is_other_mark(&self.get_piece(right))
    }

    pub fn set_piece(&mut self, pos: &Position, square: BoardSquare) {
        self.squares[pos.index()] = square;
    }

    pub fn get_piece(&self, pos: &Position) -> BoardSquare {
        self.squares[pos.index()]
    }

    fn move_piece(&mut self, from: &Position, to: &Position) {
        self.set_piece(to, self.get_piece(from));
        self.set_piece(from, BoardSquare::Empty);
    }

    pub fn apply_ply(&self, ply: &Ply) -> Board {
        match ply {
            Ply::Move { from, to } => {
                let mut clone = self.clone();

                clone.move_piece(from, to);

                clone
            }

            Ply::Castling(pos) => {
                let mut clone = self.clone();

                let (king_from, king_to, rook_from, rook_to) = pos.get_move_indexes();

                clone.move_piece(&king_from, &king_to);
                clone.move_piece(&rook_from, &rook_to);

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
                square = square.promotion(*piece);
                clone.squares[to.index()] = square;

                clone
            }
        }
    }

    pub fn square_iter(&self) -> impl Iterator<Item = (Position, BoardSquare)> + '_ {
        self.squares
            .iter()
            .enumerate()
            .map(|(i, s)| (Position::new((i / 8) as u8, (i % 8) as u8), *s))
    }
}

impl Display for Board {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        for (i, square) in self.squares.iter().enumerate() {
            if i % 8 == 0 {
                writeln!(f)?;
            }

            write!(f, "{}", square)?;
        }
        writeln!(f)
    }
}

impl Serialize for Board {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut s = serializer.serialize_seq(Some(64))?;
        for element in &self.squares {
            let element_number = match element {
                BoardSquare::Empty => 0,
                BoardSquare::Piece(Mark::White, Piece::Pawn) => 1,
                BoardSquare::Piece(Mark::White, Piece::Knight) => 2,
                BoardSquare::Piece(Mark::White, Piece::Bishop) => 3,
                BoardSquare::Piece(Mark::White, Piece::Rook) => 4,
                BoardSquare::Piece(Mark::White, Piece::Queen) => 5,
                BoardSquare::Piece(Mark::White, Piece::King) => 6,
                BoardSquare::Piece(Mark::Black, Piece::Pawn) => 7,
                BoardSquare::Piece(Mark::Black, Piece::Knight) => 8,
                BoardSquare::Piece(Mark::Black, Piece::Bishop) => 9,
                BoardSquare::Piece(Mark::Black, Piece::Rook) => 10,
                BoardSquare::Piece(Mark::Black, Piece::Queen) => 11,
                BoardSquare::Piece(Mark::Black, Piece::King) => 12,
            };
            s.serialize_element(&element_number)?;
        }
        s.end()
    }
}
