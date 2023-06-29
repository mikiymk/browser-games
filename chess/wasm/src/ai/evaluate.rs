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
