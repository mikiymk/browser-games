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

impl Iterator for PlyIterator<'_> {
    type Item = Ply;

    fn next(&mut self) -> Option<Self::Item> {
        match self {
            PlyIterator::PawnMoves(iter) => iter.next(),
            PlyIterator::Steps(iter) => iter.next(),
            PlyIterator::Runs(iter) => iter.next(),
        }
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
        loop {
            let current = self.ply.get_mut(self.count);

            match current {
                Some(iter) => match iter.next() {
                    Some(ply) => break Some(ply),
                    None => {
                        self.count += 1;
                        continue;
                    }
                },
                None => break None,
            }
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_all_board_ply_iterator() {
        //   | 0 1 2 3 4 5 6 7
        // - + - - - - - - - -
        // 0 | . . . . . . . .
        // 1 | . . . . . . . .
        // 2 | . . . . . . * .
        // 3 | . . . . r . p P
        // 4 | . . . . . . P .
        // 5 | . . . N . . . .
        // 6 | p P . . . . . .
        // 7 | . . . . . . . .

        /// initialize board
        ///
        /// ## param
        ///
        /// ```rust
        /// macro set_board!((x: u8, y: u8) => (mark: Mark, piece: Piece), ...) -> Board
        /// ```
        ///
        /// ## usage
        ///
        /// ```rust
        /// let board = set_board!{
        ///     (1, 2) => (White, Rook),
        ///     (3, 4) => (Black, King),
        /// };
        /// ```
        macro_rules! set_board {
            { $( ( $x:expr , $y:expr ) => ( $mark:expr , $piece:expr ) ),* $(,)? } => {{
                #[allow(unused_imports)]
                use Mark::{Black, White};

                #[allow(unused_imports)]
                use Piece::{Pawn, Knight, Bishop, Rook, Queen, King};

                let mut board = Board::new();

                $(
                    board.set_piece(&Position::new($x, $y), BoardSquare::new($mark, $piece));
                )*

                board
            }};
        }

        let board = set_board! {
            (3, 7) => (White, Pawn),
            (4, 6) => (White, Pawn),
            (5, 3) => (White, Knight),
            (6, 1) => (White, Pawn),

            (3, 4) => (Black, Rook),
            (1, 6) => (Black, Pawn),
            (6, 0) => (Black, Pawn),
        };
        let en_passant = EnPassant::new();

        let ply = Ply::new_move(Position::new(1, 6), Position::new(3, 6));

        let en_passant = en_passant.next_turn_available(&board, &ply);
        let board = board.apply_ply(&ply);

        let (iter_white, iter_black) = get_all_board_ply(&board, &en_passant);
        let vec_white: Vec<_> = iter_white.collect();
        let vec_black: Vec<_> = iter_black.collect();

        assert_eq!(vec_white.len(), 11);
        assert!(vec_white.contains(&Ply::new_move(Position::new(6, 1), Position::new(5, 1))));
        assert!(vec_white.contains(&Ply::new_move(Position::new(6, 1), Position::new(4, 1))));

        assert!(vec_white.contains(&Ply::new_move(Position::new(5, 3), Position::new(3, 2))));
        assert!(vec_white.contains(&Ply::new_move(Position::new(5, 3), Position::new(3, 4))));
        assert!(vec_white.contains(&Ply::new_move(Position::new(5, 3), Position::new(4, 1))));
        assert!(vec_white.contains(&Ply::new_move(Position::new(5, 3), Position::new(4, 5))));
        assert!(vec_white.contains(&Ply::new_move(Position::new(5, 3), Position::new(6, 5))));
        assert!(vec_white.contains(&Ply::new_move(Position::new(5, 3), Position::new(7, 2))));
        assert!(vec_white.contains(&Ply::new_move(Position::new(5, 3), Position::new(7, 4))));

        assert!(vec_white.contains(&Ply::new_move(Position::new(3, 7), Position::new(2, 7))));
        assert!(vec_white.contains(&Ply::new_en_passant(
            Position::new(3, 7),
            Position::new(2, 6),
            Position::new(3, 6)
        )));

        assert_eq!(vec_black.len(), 16);
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(3, 0))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(3, 1))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(3, 2))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(3, 3))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(3, 5))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(0, 4))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(1, 4))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(2, 4))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(4, 4))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(5, 4))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(6, 4))));
        assert!(vec_black.contains(&Ply::new_move(Position::new(3, 4), Position::new(7, 4))));

        assert!(vec_black.contains(&Ply::new_promotion(
            Position::new(6, 0),
            Position::new(7, 0),
            Piece::Knight
        )));
        assert!(vec_black.contains(&Ply::new_promotion(
            Position::new(6, 0),
            Position::new(7, 0),
            Piece::Bishop
        )));
        assert!(vec_black.contains(&Ply::new_promotion(
            Position::new(6, 0),
            Position::new(7, 0),
            Piece::Rook
        )));
        assert!(vec_black.contains(&Ply::new_promotion(
            Position::new(6, 0),
            Position::new(7, 0),
            Piece::Queen
        )));
    }
}
