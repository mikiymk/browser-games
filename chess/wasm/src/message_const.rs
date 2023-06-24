// 0..64
// square index

pub const RESET: usize = 71;
pub const PROMOTION: usize = 72;
pub const RESIGN: usize = 73;

pub const PROMOTION_KNIGHT: u8 = 81;
pub const PROMOTION_BISHOP: u8 = 82;
pub const PROMOTION_ROOK: u8 = 83;
pub const PROMOTION_QUEEN: u8 = 84;

pub const MESSAGE_WHITE_TURN: &'static str = "White turn";
pub const MESSAGE_BLACK_TURN: &'static str = "Black turn";
pub const MESSAGE_WHITE_WIN: &'static str = "White win";
pub const MESSAGE_BLACK_WIN: &'static str = "Black win";
pub const MESSAGE_STALEMATE: &'static str = "Draw - stalemate";
pub const MESSAGE_INSUFFICIENT_MATERIAL: &'static str = "Draw - insufficient material";
pub const MESSAGE_FIFTY_MOVE: &'static str = "Draw - fifty-move rule";
pub const MESSAGE_THREEFOLD_REPETITION: &'static str = "Draw - threefold repetition";
