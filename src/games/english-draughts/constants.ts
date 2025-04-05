const PIECE = 0b0001;
const BLACK = 0b0010;
const KING = 0b0100;

export const COLOR_PAWN_WHITE = PIECE;
export const COLOR_KING_WHITE = PIECE | KING;
export const COLOR_PAWN_BLACK = PIECE | BLACK;
export const COLOR_KING_BLACK = PIECE | BLACK | KING;

export const MOVE_TARGET = 16;
export const NotEnd = 0;
