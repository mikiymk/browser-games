use crate::{get_ply::steps::StepPlyIterator, state::board::Board, state::position::Position};

pub fn get_king_ply(board: &Board, from: Position) -> StepPlyIterator<'_> {
    const KING_STEPS: [(i8, i8); 8] = [
        (1, 0),
        (-1, 0),
        (0, 1),
        (0, -1),
        (1, 1),
        (1, -1),
        (-1, 1),
        (-1, -1),
    ];

    StepPlyIterator::new(&KING_STEPS, board, from)
}

#[cfg(test)]
mod test {
    use crate::{
        state::ply::Ply,
        state::position::Position,
        state::{board::Board, board_square::Square},
    };

    use super::get_king_ply;

    #[test]
    fn test_king_iterator() {
        //   | 0 1 2 3 4 5 6 7
        // - + - - - - - - - -
        // 0 | . . . . . . . .
        // 1 | . . . . . . . .
        // 2 | . . . . . . . .
        // 3 | . . . * * P . .
        // 4 | . . . * K * . .
        // 5 | . . . p * * . .
        // 6 | . . . . . . . .
        // 7 | . . . . . . . .

        let mut board = Board::new();
        board.set_piece(&Position::new(4, 4), Square::WHITE_KING);
        board.set_piece(&Position::new(3, 5), Square::WHITE_PAWN);
        board.set_piece(&Position::new(5, 3), Square::BLACK_PAWN);

        let from = Position::new(4, 4);

        let vec: Vec<Ply> = get_king_ply(&board, from).collect();

        assert_eq!(vec.len(), 7);
        assert!(vec.contains(&Ply::new_move(from, Position::new(3, 3))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(3, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 3))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 5))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(5, 3))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(5, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(5, 5))));
    }
}
