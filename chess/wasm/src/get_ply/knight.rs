use crate::{get_ply::steps::StepPlyIterator, state::board::Board, state::position::Position};

pub fn get_knight_ply(board: &Board, from: Position) -> StepPlyIterator<'_> {
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
        state::ply::Ply,
        state::position::Position,
        state::{board::Board, board_square::Square},
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
        board.set_piece(&Position::new(4, 4), Square::WHITE_KNIGHT);
        board.set_piece(&Position::new(2, 3), Square::WHITE_PAWN);
        board.set_piece(&Position::new(6, 5), Square::BLACK_PAWN);

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
