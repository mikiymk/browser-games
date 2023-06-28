use crate::state::{
    board::Board, board_square::BoardSquare, mark::Mark, piece::Piece, position::Position,
};

pub fn initial_board() -> Board {
    let mut board = Board::new();

    board.set_piece(&Position::B_RQ, BoardSquare::new(Mark::Black, Piece::Rook));
    board.set_piece(
        &Position::B_NQ,
        BoardSquare::new(Mark::Black, Piece::Knight),
    );
    board.set_piece(
        &Position::B_BQ,
        BoardSquare::new(Mark::Black, Piece::Bishop),
    );
    board.set_piece(&Position::B_Q, BoardSquare::new(Mark::Black, Piece::Queen));
    board.set_piece(&Position::B_K, BoardSquare::new(Mark::Black, Piece::King));
    board.set_piece(
        &Position::B_BK,
        BoardSquare::new(Mark::Black, Piece::Bishop),
    );
    board.set_piece(
        &Position::B_NK,
        BoardSquare::new(Mark::Black, Piece::Knight),
    );
    board.set_piece(&Position::B_RK, BoardSquare::new(Mark::Black, Piece::Rook));

    board.set_piece(
        &Position::new(1, 0),
        BoardSquare::new(Mark::Black, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(1, 1),
        BoardSquare::new(Mark::Black, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(1, 2),
        BoardSquare::new(Mark::Black, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(1, 3),
        BoardSquare::new(Mark::Black, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(1, 4),
        BoardSquare::new(Mark::Black, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(1, 5),
        BoardSquare::new(Mark::Black, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(1, 6),
        BoardSquare::new(Mark::Black, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(1, 7),
        BoardSquare::new(Mark::Black, Piece::Pawn),
    );

    board.set_piece(
        &Position::new(7, 0),
        BoardSquare::new(Mark::White, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(7, 1),
        BoardSquare::new(Mark::White, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(7, 2),
        BoardSquare::new(Mark::White, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(7, 3),
        BoardSquare::new(Mark::White, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(7, 4),
        BoardSquare::new(Mark::White, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(7, 5),
        BoardSquare::new(Mark::White, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(7, 6),
        BoardSquare::new(Mark::White, Piece::Pawn),
    );
    board.set_piece(
        &Position::new(7, 7),
        BoardSquare::new(Mark::White, Piece::Pawn),
    );

    board.set_piece(&Position::W_RQ, BoardSquare::new(Mark::White, Piece::Rook));
    board.set_piece(
        &Position::W_NQ,
        BoardSquare::new(Mark::White, Piece::Knight),
    );
    board.set_piece(
        &Position::W_BQ,
        BoardSquare::new(Mark::White, Piece::Bishop),
    );
    board.set_piece(&Position::W_Q, BoardSquare::new(Mark::White, Piece::Queen));
    board.set_piece(&Position::W_K, BoardSquare::new(Mark::White, Piece::King));
    board.set_piece(
        &Position::W_BK,
        BoardSquare::new(Mark::White, Piece::Bishop),
    );
    board.set_piece(
        &Position::W_NK,
        BoardSquare::new(Mark::White, Piece::Knight),
    );
    board.set_piece(&Position::W_RK, BoardSquare::new(Mark::White, Piece::Rook));

    board
}
