export const PAWN = "pawn";
export const PAWN_PROMOTED = "pawn-promoted";
export const LANCE = "lance";
export const LANCE_PROMOTED = "lance-promoted";
export const KNIGHT = "knight";
export const KNIGHT_PROMOTED = "knight-promoted";
export const SILVER = "silver";
export const SILVER_PROMOTED = "silver-promoted";
export const GOLD = "gold";
export const BISHOP = "bishop";
export const BISHOP_PROMOTED = "bishop-promoted";
export const ROOK = "rook";
export const ROOK_PROMOTED = "rook-promoted";
export const KING = "king";

export const SHOGI_PIECES = [
  PAWN,
  PAWN_PROMOTED,
  LANCE,
  LANCE_PROMOTED,
  KNIGHT,
  KNIGHT_PROMOTED,
  SILVER,
  SILVER_PROMOTED,
  GOLD,
  BISHOP,
  BISHOP_PROMOTED,
  ROOK,
  ROOK_PROMOTED,
  KING,
] as const;
export type ShogiPiece = (typeof SHOGI_PIECES)[number];

export const UP = "up";
export const DOWN = "down";

export const SHOGI_DIRECTIONS = [UP, DOWN] as const;
export type Id = `${ShogiPiece}-${ShogiDirection}`;
export type ShogiDirection = (typeof SHOGI_DIRECTIONS)[number];
