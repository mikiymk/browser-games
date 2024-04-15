export const WHITE = 1; // 先手
export const BLACK = 2; // 後手

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
