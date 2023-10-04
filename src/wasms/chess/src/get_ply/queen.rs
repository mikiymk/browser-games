use crate::{
    get_ply::runs::{RunDirection, RunPlyIterator},
    state::board::Board,
    state::position::Position,
};

pub fn get_queen_ply(board: &Board, from: Position) -> RunPlyIterator<'_> {
    const QUEEN_DIRECTIONS: [RunDirection; 8] = [
        RunDirection::Up,
        RunDirection::Down,
        RunDirection::Left,
        RunDirection::Right,
        RunDirection::LeftUp,
        RunDirection::LeftDown,
        RunDirection::RightUp,
        RunDirection::RightDown,
    ];

    RunPlyIterator::new(&QUEEN_DIRECTIONS, board, from)
}

#[cfg(test)]
mod test {
    use crate::{
        state::ply::Ply,
        state::position::Position,
        state::{board::Board, board_square::Square},
    };

    use super::get_queen_ply;

    #[test]
    fn test_queen_iterator() {
        //   | 0 1 2 3 4 5 6 7
        // - + - - - - - - - -
        // 0 | * . . . . . . .
        // 1 | . * . . P . . *
        // 2 | . . * . * . * .
        // 3 | . . . * * * . .
        // 4 | * * * * Q * * *
        // 5 | . . . * * * . .
        // 6 | . . p . * . * .
        // 7 | . . . . * . . *

        let mut board = Board::new();
        board.set_piece(&Position::new(4, 4), Square::WHITE_QUEEN);
        board.set_piece(&Position::new(1, 4), Square::WHITE_PAWN);
        board.set_piece(&Position::new(6, 2), Square::BLACK_PAWN);

        let from = Position::new(4, 4);

        let vec: Vec<Ply> = get_queen_ply(&board, from).collect();

        assert_eq!(vec.len(), 24);
        assert!(vec.contains(&Ply::new_move(from, Position::new(2, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(3, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(5, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(6, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(7, 4))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 0))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 1))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 2))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 3))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 5))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 6))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(4, 7))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(0, 0))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(1, 1))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(2, 2))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(3, 3))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(5, 5))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(6, 6))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(7, 7))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(6, 2))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(5, 3))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(3, 5))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(2, 6))));
        assert!(vec.contains(&Ply::new_move(from, Position::new(1, 7))));
    }
}
