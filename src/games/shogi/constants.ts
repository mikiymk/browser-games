export const WHITE = 1; // 先手
export const BLACK = 2; // 後手

export const BLACK_KING = 0b1000_0000;
export const BLACK_ROOK = 0b1000_0001;
export const BLACK_BISHOP = 0b1000_0010;
export const BLACK_GOLD = 0b1000_0011;
export const BLACK_SILVER = 0b1000_0100;
export const BLACK_KNIGHT = 0b1000_0101;
export const BLACK_LANCE = 0b1000_0110;
export const BLACK_PAWN = 0b1000_0111;

export const BLACK_ROOK_PROMOTED = 0b1001_0001;
export const BLACK_BISHOP_PROMOTED = 0b1001_0010;
export const BLACK_SILVER_PROMOTED = 0b1001_0100;
export const BLACK_KNIGHT_PROMOTED = 0b1001_0101;
export const BLACK_LANCE_PROMOTED = 0b1001_0110;
export const BLACK_PAWN_PROMOTED = 0b1001_0111;

export const WHITE_KING = 0b1010_0000;
export const WHITE_ROOK = 0b1010_0001;
export const WHITE_BISHOP = 0b1010_0010;
export const WHITE_GOLD = 0b1010_0011;
export const WHITE_SILVER = 0b1010_0100;
export const WHITE_KNIGHT = 0b1010_0101;
export const WHITE_LANCE = 0b1010_0110;
export const WHITE_PAWN = 0b1010_0111;

export const WHITE_ROOK_PROMOTED = 0b1011_0001;
export const WHITE_BISHOP_PROMOTED = 0b1011_0010;
export const WHITE_SILVER_PROMOTED = 0b1011_0100;
export const WHITE_KNIGHT_PROMOTED = 0b1011_0101;
export const WHITE_LANCE_PROMOTED = 0b1011_0110;
export const WHITE_PAWN_PROMOTED = 0b1011_0111;

export const EMPTY = 0b1000_0000;
export const COLOR = 0b0010_0000;
export const PROMOTED = 0b0001_0000;
export const PIECE = 0b0000_0111;
export const KING = 0b0000_0000;
export const ROOK = 0b0000_0001;
export const BISHOP = 0b0000_0010;
export const GOLD = 0b0000_0011;
export const SILVER = 0b0000_0100;
export const KNIGHT = 0b0000_0101;
export const LANCE = 0b0000_0110;
export const PAWN = 0b0000_0111;

export const MOVE_TARGET = 1;

export type Hand = readonly [
  pawn: number,
  lance: number,
  knight: number,
  silver: number,
  gold: number,
  bishop: number,
  rook: number,
  king: number,
];
