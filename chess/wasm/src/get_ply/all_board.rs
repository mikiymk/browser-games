use crate::{
    piece::Piece,
    ply::Ply,
    position::Position,
    state::{board::Board, board_square::BoardSquare, en_passant::EnPassant, mark::Mark},
};

use super::{
    get_bishop_ply, get_king_ply, get_knight_ply, get_pawn_ply, get_queen_ply, get_rook_ply,
    pawn::PawnPlyIterator, runs::RunPlyIterator, steps::StepPlyIterator,
};

enum PlyIterator<'a> {
    PawnMoves(PawnPlyIterator),
    Steps(StepPlyIterator<'a>),
    Runs(RunPlyIterator<'a>),
}
impl Iterator for &PlyIterator<'_> {
    type Item = Ply;

    fn next(&mut self) -> Option<Self::Item> {
        todo!()
    }
}

struct AllPlyIterator<'a> {
    ply: Vec<PlyIterator<'a>>,

    count: usize,
}

impl<'a> AllPlyIterator<'a> {
    fn new(ply: Vec<PlyIterator<'a>>) -> Self {
        AllPlyIterator { ply, count: 0 }
    }
}

impl Iterator for AllPlyIterator<'_> {
    type Item = Ply;

    fn next(&mut self) -> Option<Self::Item> {
        let mut current: Option<&PlyIterator<'_>> = self.ply.get(self.count);

        match current.as_mut() {
            Some(iter) => iter.next(),
            None => None,
        }
    }
}

fn get_ply<'a>(
    board: &'a Board,
    from: &Position,
    en_passant: &EnPassant,
) -> Option<PlyIterator<'a>> {
    match board.get_piece(from) {
        BoardSquare::Piece(mark, Piece::Pawn) => Some(PlyIterator::PawnMoves(get_pawn_ply(
            board, from, &mark, en_passant,
        ))),
        BoardSquare::Piece(_, Piece::Knight) => {
            Some(PlyIterator::Steps(get_knight_ply(board, *from)))
        }
        BoardSquare::Piece(_, Piece::Bishop) => {
            Some(PlyIterator::Runs(get_bishop_ply(board, *from)))
        }
        BoardSquare::Piece(_, Piece::Rook) => Some(PlyIterator::Runs(get_rook_ply(board, *from))),
        BoardSquare::Piece(_, Piece::Queen) => Some(PlyIterator::Runs(get_queen_ply(board, *from))),
        BoardSquare::Piece(_, Piece::King) => Some(PlyIterator::Steps(get_king_ply(board, *from))),
        BoardSquare::Empty => None,
    }
}

pub fn get_all_board_ply<'a>(
    board: &'a Board,
    en_passant: &EnPassant,
) -> (
    impl Iterator<Item = Ply> + 'a, // black ply
    impl Iterator<Item = Ply> + 'a, // white ply
) {
    let mut white_ply = Vec::new();
    let mut black_ply = Vec::new();

    for (position, square) in board.square_iter() {
        match square.mark() {
            Some(Mark::White) => {
                if let Some(ply) = get_ply(board, &position, en_passant) {
                    white_ply.push(ply)
                }
            }
            Some(Mark::Black) => {
                if let Some(ply) = get_ply(board, &position, en_passant) {
                    black_ply.push(ply)
                }
            }
            _ => (),
        }
    }

    (
        AllPlyIterator::new(white_ply),
        AllPlyIterator::new(black_ply),
    )
}
