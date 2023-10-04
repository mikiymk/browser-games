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

impl Piece {
    pub fn try_from_str(value: &str) -> Option<Self> {
        match value {
            "P" => Some(Piece::Pawn),
            "N" => Some(Piece::Knight),
            "B" => Some(Piece::Bishop),
            "R" => Some(Piece::Rook),
            "Q" => Some(Piece::Queen),
            "K" => Some(Piece::King),
            _ => None,
        }
    }
}

impl Display for Piece {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Piece::Pawn => "P",
                Piece::Knight => "N",
                Piece::Bishop => "B",
                Piece::Rook => "R",
                Piece::Queen => "Q",
                Piece::King => "K",
            }
        )
    }
}
