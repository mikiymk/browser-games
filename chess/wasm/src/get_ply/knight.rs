use crate::{get_ply::steps::StepPlyIterator, ply::Ply, position::Position, state::board::Board};

pub fn get_knight_ply(board: &Board, from: Position) -> impl Iterator<Item = Ply> + '_ {
    const KNIGHT_STEPS: [(i8, i8); 8] = [
        (1, 2),
        (1, -2),
        (-1, 2),
        (-1, -2),
        (2, 1),
        (2, -1),
        (-2, 1),
        (-2, -1),
    ];

    StepPlyIterator::new(&KNIGHT_STEPS, board, from)
}

#[cfg(test)]
mod test {
    use crate::{
        piece::Piece,
        ply::Ply,
        position::Position,
        state::{board::Board, board_square::BoardSquare, mark::Mark},
    };

    use super::get_knight_ply;

    #[test]
    fn test_knight_iterator() {
        //   | 0 1 2 3 4 5 6 7
        // - + - - - - - - - -
        // 0 | . . . . . . . .
        // 1 | . . . . . . . .
        // 2 | . . . P . * . .
        // 3 | . . * . . . * .
        // 4 | . . . . N . . .
        // 5 | . . * . . . * .
        // 6 | . . . * . p . .
        // 7 | . . . . . . . .

        let mut board = Board::new();
        board.set_piece(
            &Position::new(4, 4),
            BoardSquare::new(Mark::White, Piece::Knight),
        );
        board.set_piece(
            &Position::new(2, 3),
            BoardSquare::new(Mark::White, Piece::Pawn),
        );
        board.set_piece(
            &Position::new(6, 5),
            BoardSquare::new(Mark::Black, Piece::Pawn),
        );

        let from = Position::new(4, 4);

        let mut iter = get_knight_ply(&board, from);

        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(5, 6))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(5, 2))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(3, 6))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(3, 2))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(6, 5))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(6, 3))));
        assert_eq!(iter.next(), Some(Ply::new_move(from, Position::new(2, 5))));
        assert_eq!(iter.next(), None);
    }
}
