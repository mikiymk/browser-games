// 0..64
// square index

pub const RESET: usize = 71;
pub const PROMOTION: usize = 72;

pub const PROMOTION_KNIGHT: u8 = 81;
pub const PROMOTION_BISHOP: u8 = 82;
pub const PROMOTION_ROOK: u8 = 83;
pub const PROMOTION_QUEEN: u8 = 84;

pub const MESSAGE_WHITE_TURN: &str = "White turn";
pub const MESSAGE_BLACK_TURN: &str = "Black turn";
pub const MESSAGE_WHITE_WIN: &str = "White win";
pub const MESSAGE_BLACK_WIN: &str = "Black win";
pub const MESSAGE_NO_WHITE_KING: &str = "Draw - there is no white king";
pub const MESSAGE_NO_BLACK_KING: &str = "Draw - there is no black king";
pub const MESSAGE_STALEMATE: &str = "Draw - stalemate";
pub const MESSAGE_INSUFFICIENT_MATERIAL: &str = "Draw - insufficient material";
pub const MESSAGE_FIFTY_MOVE: &str = "Draw - fifty-move rule";
pub const MESSAGE_THREEFOLD_REPETITION: &str = "Draw - threefold repetition";
