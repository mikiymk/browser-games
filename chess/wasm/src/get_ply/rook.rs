use crate::{
    get_ply::runs::{RunDirection, RunPlyIterator},
    ply::Ply,
    position::Position,
    state::board::Board,
};

pub fn get_rook_ply(board: &Board, from: Position) -> impl Iterator<Item = Ply> + '_ {
    const ROOK_DIRECTIONS: [RunDirection; 4] = [
        RunDirection::Up,
        RunDirection::Down,
        RunDirection::Left,
        RunDirection::Right,
    ];

    RunPlyIterator::new(&ROOK_DIRECTIONS, board, from)
}

#[cfg(test)]
mod test {
    use crate::{
        piece::Piece,
        ply::Ply,
        position::Position,
        state::{board::Board, board_square::BoardSquare, mark::Mark},
    };

    use super::get_rook_ply;

    #[test]
    fn test_rook_iterator() {
        //   | 0 1 2 3 4 5 6 7
        // - + - - - - - - - -
        // 0 | . . . . . . . .
        // 1 | . . . . P . . .
        // 2 | . . . . * . . .
        // 3 | . . . . * . . .
        // 4 | . p * * R * * *
        // 5 | . . . . * . . .
        // 6 | . . . . * . . .
        // 7 | . . . . * . . .

        let mut board = Board::new();
        board.set_piece(
            &Position::new(4, 4),
            BoardSquare::new(Mark::White, Piece::Rook),
        );
        board.set_piece(
            &Position::new(1, 4),
            BoardSquare::new(Mark::White, Piece::Pawn),
        );
        board.set_piece(
            &Position::new(4, 1),
            BoardSquare::new(Mark::Black, Piece::Pawn),
        );

        let from = Position::new(4, 4);

        let vec: Vec<Ply> = get_rook_ply(&board, from).collect();

        assert_eq!(vec.len(), 11);
        assert!(vec.contains(&Ply::new_move(from, Position::new(2, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(3, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(5, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(6, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(7, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 1))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 2))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 3))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 5))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 6))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 7))));
    }
}
