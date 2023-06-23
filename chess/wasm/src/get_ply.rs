mod all_board;
mod bishop;
mod king;
mod knight;
mod pawn;
mod queen;
mod rook;
mod runs;
mod steps;

pub use all_board::{get_all_board_ply, get_castling_ply, get_ply};
pub use bishop::get_bishop_ply;
pub use king::get_king_ply;
pub use knight::get_knight_ply;
pub use pawn::get_pawn_ply;
pub use queen::get_queen_ply;
pub use rook::get_rook_ply;

//   | 0 1 2 3 4 5 6 7
// - + - - - - - - - -
// 0 | . . . . . . . .
// 1 | . . . . . . . .
// 2 | . . . . . . . .
// 3 | . . . . . . . .
// 4 | . . . . . . . .
// 5 | . . . . . . . .
// 6 | . . . . . . . .
// 7 | . . . . . . . .
