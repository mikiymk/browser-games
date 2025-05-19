export const PAWN = "pawn";
export const KNIGHT = "knight";
export const BISHOP = "bishop";
export const ROOK = "rook";
export const QUEEN = "queen";
export const KING = "king";

export const PIECES = [PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING] as const;
export type Piece = (typeof PIECES)[number];
