use std::fmt::Display;

use serde::{ser::SerializeSeq, Serialize};

use crate::{state::mark::Mark, state::piece::Piece, state::ply::Ply, state::position::Position};

use super::board_square::Square;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Board {
    squares: [Square; 64],
}

impl Board {
    pub fn new() -> Board {
        Self {
            squares: [Square::Empty; 64],
        }
    }

    pub fn try_from_slice(value: &[u8]) -> Option<Self> {
        let mut board = Self::new();

        for (i, value) in value.iter().enumerate() {
            if i >= 64 {
                break;
            }

            board.squares[i] = Square::try_from_u8(*value)?;
        }

        Some(board)
    }

    pub fn is_same_mark(&self, left: &Position, right: &Position) -> bool {
        self.get_piece(left).is_same_mark(&self.get_piece(right))
    }

    pub fn is_other_mark(&self, left: &Position, right: &Position) -> bool {
        self.get_piece(left).is_other_mark(&self.get_piece(right))
    }

    pub fn set_piece(&mut self, pos: &Position, square: Square) {
        self.squares[pos.index()] = square;
    }

    pub fn get_piece(&self, pos: &Position) -> Square {
        self.squares[pos.index()]
    }

    fn move_piece(&mut self, from: &Position, to: &Position) {
        self.set_piece(to, self.get_piece(from));
        self.set_piece(from, Square::Empty);
    }

    pub fn get_next(&self, ply: &Ply) -> Self {
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
                clone.squares[capture.index()] = Square::Empty;

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

    pub fn square_iter(&self) -> impl Iterator<Item = &Square> + '_ {
        self.squares.iter()
    }

    pub fn square_position_iter(&self) -> impl Iterator<Item = (Position, Square)> + '_ {
        self.squares
            .iter()
            .enumerate()
            .map(|(i, s)| (Position::new_from_position(i), *s))
    }

    pub fn get_king_position(&self, mark: &Mark) -> Option<Position> {
        for (position, square) in self.square_position_iter() {
            if square == Square::new(*mark, Piece::King) {
                return Some(position);
            }
        }

        None
    }

    pub fn as_vec_u8(&self) -> Vec<u8> {
        self.squares.iter().map(Square::as_u8).collect()
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
                Square::Empty => 0,
                Square::Piece(Mark::White, Piece::Pawn) => 1,
                Square::Piece(Mark::White, Piece::Knight) => 2,
                Square::Piece(Mark::White, Piece::Bishop) => 3,
                Square::Piece(Mark::White, Piece::Rook) => 4,
                Square::Piece(Mark::White, Piece::Queen) => 5,
                Square::Piece(Mark::White, Piece::King) => 6,
                Square::Piece(Mark::Black, Piece::Pawn) => 7,
                Square::Piece(Mark::Black, Piece::Knight) => 8,
                Square::Piece(Mark::Black, Piece::Bishop) => 9,
                Square::Piece(Mark::Black, Piece::Rook) => 10,
                Square::Piece(Mark::Black, Piece::Queen) => 11,
                Square::Piece(Mark::Black, Piece::King) => 12,
            };
            s.serialize_element(&element_number)?;
        }
        s.end()
    }
}
