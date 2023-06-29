use crate::state::{board::Board, board_square::Square, position::Position};

pub fn initial_board() -> Board {
    let mut board = Board::new();

    board.set_piece(&Position::B_RQ, Square::BLACK_ROOK);
    board.set_piece(&Position::B_NQ, Square::BLACK_KNIGHT);
    board.set_piece(&Position::B_BQ, Square::BLACK_BISHOP);
    board.set_piece(&Position::B_Q, Square::BLACK_QUEEN);
    board.set_piece(&Position::B_K, Square::BLACK_KING);
    board.set_piece(&Position::B_BK, Square::BLACK_BISHOP);
    board.set_piece(&Position::B_NK, Square::BLACK_KNIGHT);
    board.set_piece(&Position::B_RK, Square::BLACK_ROOK);

    board.set_piece(&Position::new(1, 0), Square::BLACK_PAWN);
    board.set_piece(&Position::new(1, 1), Square::BLACK_PAWN);
    board.set_piece(&Position::new(1, 2), Square::BLACK_PAWN);
    board.set_piece(&Position::new(1, 3), Square::BLACK_PAWN);
    board.set_piece(&Position::new(1, 4), Square::BLACK_PAWN);
    board.set_piece(&Position::new(1, 5), Square::BLACK_PAWN);
    board.set_piece(&Position::new(1, 6), Square::BLACK_PAWN);
    board.set_piece(&Position::new(1, 7), Square::BLACK_PAWN);

    board.set_piece(&Position::new(7, 0), Square::WHITE_PAWN);
    board.set_piece(&Position::new(7, 1), Square::WHITE_PAWN);
    board.set_piece(&Position::new(7, 2), Square::WHITE_PAWN);
    board.set_piece(&Position::new(7, 3), Square::WHITE_PAWN);
    board.set_piece(&Position::new(7, 4), Square::WHITE_PAWN);
    board.set_piece(&Position::new(7, 5), Square::WHITE_PAWN);
    board.set_piece(&Position::new(7, 6), Square::WHITE_PAWN);
    board.set_piece(&Position::new(7, 7), Square::WHITE_PAWN);

    board.set_piece(&Position::W_RQ, Square::WHITE_ROOK);
    board.set_piece(&Position::W_NQ, Square::WHITE_KNIGHT);
    board.set_piece(&Position::W_BQ, Square::WHITE_BISHOP);
    board.set_piece(&Position::W_Q, Square::WHITE_QUEEN);
    board.set_piece(&Position::W_K, Square::WHITE_KING);
    board.set_piece(&Position::W_BK, Square::WHITE_BISHOP);
    board.set_piece(&Position::W_NK, Square::WHITE_KNIGHT);
    board.set_piece(&Position::W_RK, Square::WHITE_ROOK);

    board
}
