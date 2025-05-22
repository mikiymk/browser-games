export const PAWN = "pawn";
export const KNIGHT = "knight";
export const BISHOP = "bishop";
export const ROOK = "rook";
export const QUEEN = "queen";
export const KING = "king";

export const CHESS_PIECES = [PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING] as const;
export type ChessPiece = (typeof CHESS_PIECES)[number];

export const WHITE = "white";
export const BLACK = "black";

export const CHESS_COLORS = [WHITE, BLACK] as const;
export type ChessColor = (typeof CHESS_COLORS)[number];
