use crate::{get_ply::steps::StepPlyIterator, ply::Ply, position::Position, state::board::Board};

pub fn get_king_ply(board: &Board, from: Position) -> impl Iterator<Item = Ply> + '_ {
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
        piece::Piece,
        ply::Ply,
        position::Position,
        state::{board::Board, board_square::BoardSquare, mark::Mark},
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
        board.set_piece(
            &Position::new(4, 4),
            BoardSquare::new(Mark::White, Piece::King),
        );
        board.set_piece(
            &Position::new(3, 5),
            BoardSquare::new(Mark::White, Piece::Pawn),
        );
        board.set_piece(
            &Position::new(5, 3),
            BoardSquare::new(Mark::Black, Piece::Pawn),
        );

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
