use crate::{
    board::{Board, BoardSquare},
    piece::Piece,
    ply::Ply,
    position::Position,
};

pub struct EnPassant(Option<Position>);

impl EnPassant {
    pub fn new() -> Self {
        EnPassant(None)
    }

    pub fn apply_ply(&self, board: Board, ply: Ply) -> Self {
        match ply {
            Ply::Move { from, to } => match board.get_piece(from) {
                BoardSquare::WhitePiece(Piece::Pawn) | BoardSquare::BlackPiece(Piece::Pawn) => {
                    let diff_x = from.x.abs_diff(to.x);

                    if diff_x == 2 && from.y == to.y {
                        let x = (from.x + to.x) / 2;
                        let y = from.y;

                        EnPassant(Position::try_new(x, y))
                    } else {
                        EnPassant(None)
                    }
                }
                _ => EnPassant(None),
            },
            _ => EnPassant(None),
        }
    }
}
