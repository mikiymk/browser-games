use crate::{
    get_ply::{filter_checked_ply, get_all_board_ply},
    state::{
        board::Board, board_square::Square, castling::Castling, en_passant::EnPassant,
        game_state::GameState, mark::Mark, piece::Piece,
    },
};

pub fn evaluate_function(state: &GameState) -> f64 {
    1.0 * count_pieces(&state.board)
        + 0.2
            * count_movable(
                &state.board,
                &Mark::White,
                &state.castling,
                &state.en_passant,
            )
        + -0.1
            * count_movable(
                &state.board,
                &Mark::Black,
                &state.castling,
                &state.en_passant,
            )
}

fn count_pieces(board: &Board) -> f64 {
    let mut sum = 0.0;
    for square in board.square_iter() {
        sum += match square {
            Square::Piece(Mark::White, Piece::Pawn) => 1.0,
            Square::Piece(Mark::White, Piece::Knight) => 3.0,
            Square::Piece(Mark::White, Piece::Bishop) => 3.0,
            Square::Piece(Mark::White, Piece::Rook) => 5.0,
            Square::Piece(Mark::White, Piece::Queen) => 9.0,
            Square::Piece(Mark::White, Piece::King) => 1.0e7,
            Square::Piece(Mark::Black, Piece::Pawn) => -1.0,
            Square::Piece(Mark::Black, Piece::Knight) => -3.0,
            Square::Piece(Mark::Black, Piece::Bishop) => -3.0,
            Square::Piece(Mark::Black, Piece::Rook) => -5.0,
            Square::Piece(Mark::Black, Piece::Queen) => -9.0,
            Square::Piece(Mark::Black, Piece::King) => -1.0e7,
            Square::Empty => 0.0,
        };
    }

    sum
}

fn count_movable(board: &Board, mark: &Mark, castling: &Castling, en_passant: &EnPassant) -> f64 {
    get_all_board_ply(mark, board, castling, en_passant)
        .filter(|ply| filter_checked_ply(ply, mark, board))
        .count() as f64
}

#[cfg(test)]
mod tests {
    use crate::{
        state::{castling::Castling, en_passant::EnPassant},
        test_utils::initial_board,
    };

    use super::*;

    #[test]
    fn test_count_pieces_1() {
        let board = Board::new();

        let result = count_pieces(&board);

        assert_eq!(result, 0.0);
    }

    #[test]
    fn test_count_pieces_2() {
        let board = initial_board();

        let result = count_pieces(&board);

        assert_eq!(result, 0.0);
    }

    #[test]
    fn test_count_movable_white() {
        let board = initial_board();
        let mark = Mark::White;
        let castling = Castling::new(0);
        let en_passant = EnPassant::new(None);

        let result = count_movable(&board, &mark, &castling, &en_passant);

        assert_eq!(result, 20.0);
    }

    #[test]
    fn test_count_movable_black() {
        let board = initial_board();
        let mark = Mark::Black;
        let castling = Castling::new(0);
        let en_passant = EnPassant::new(None);

        let result = count_movable(&board, &mark, &castling, &en_passant);

        assert_eq!(result, 20.0);
    }

    #[test]
    fn test_evaluate_function_1() {
        let board = initial_board();

        let mark = Mark::White;
        let castling = Castling::new(0);
        let en_passant = EnPassant::new(None);
        let state = GameState::new(board, mark, castling, en_passant);

        let result = evaluate_function(&state);

        // 1 * 0 + 0.2 * 20 - 0.1 * 20
        assert_eq!(result, 2.0);
    }
}
