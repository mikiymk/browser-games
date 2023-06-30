use crate::state::{board::Board, board_square::Square, position::Position};

/// initialize board
///
/// ## param
///
/// ```rust
/// macro set_board!((x: u8, y: u8) => (mark: Mark, piece: Piece), ...) -> Board
/// ```
///
/// ## usage
///
/// ```rust
/// let board = set_board!{
///     (1, 2) => (White, Rook),
///     (3, 4) => (Black, King),
/// };
/// ```
macro_rules! set_board_pieces {
    { $( ( $x:expr , $y:expr ) => ( $mark:expr , $piece:expr ) ),* $(,)? } => {{
        use crate::state::mark::Mark;
        use crate::state::piece::Piece;
        use crate::state::board::Board;
        use crate::state::position::Position;
        use crate::state::board_square::Square;

        #[allow(unused_imports)]
        use Mark::{Black, White};

        #[allow(unused_imports)]
        use Piece::{Pawn, Knight, Bishop, Rook, Queen, King};

        let mut board = Board::new();

        $(
            board.set_piece(&Position::new($x, $y), Square::new($mark, $piece));
        )*

        board
    }};
}

pub(crate) use set_board_pieces;

#[allow(dead_code)]
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

    board.set_piece(&Position::new(6, 0), Square::WHITE_PAWN);
    board.set_piece(&Position::new(6, 1), Square::WHITE_PAWN);
    board.set_piece(&Position::new(6, 2), Square::WHITE_PAWN);
    board.set_piece(&Position::new(6, 3), Square::WHITE_PAWN);
    board.set_piece(&Position::new(6, 4), Square::WHITE_PAWN);
    board.set_piece(&Position::new(6, 5), Square::WHITE_PAWN);
    board.set_piece(&Position::new(6, 6), Square::WHITE_PAWN);
    board.set_piece(&Position::new(6, 7), Square::WHITE_PAWN);

    board.set_piece(&Position::WHITE_ROOK_QUEENSIDE, Square::WHITE_ROOK);
    board.set_piece(&Position::WHITE_KNIGHT_QUEENSIDE, Square::WHITE_KNIGHT);
    board.set_piece(&Position::W_BQ, Square::WHITE_BISHOP);
    board.set_piece(&Position::W_Q, Square::WHITE_QUEEN);
    board.set_piece(&Position::W_K, Square::WHITE_KING);
    board.set_piece(&Position::W_BK, Square::WHITE_BISHOP);
    board.set_piece(&Position::W_NK, Square::WHITE_KNIGHT);
    board.set_piece(&Position::W_RK, Square::WHITE_ROOK);

    board
}
