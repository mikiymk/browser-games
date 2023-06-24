use std::fmt::Display;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Piece {
    Pawn,
    Knight,
    Bishop,
    Rook,
    Queen,
    King,
}

impl Display for Piece {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Piece::Pawn => "Pawn",
                Piece::Knight => "Knight",
                Piece::Bishop => "Bishop",
                Piece::Rook => "Rook",
                Piece::Queen => "Queen",
                Piece::King => "King",
            }
        )
    }
}
