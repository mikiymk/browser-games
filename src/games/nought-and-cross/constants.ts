export const NOUGHT_WASM = 0;
export const CROSS_WASM = 1;

export const NOUGHT = 1;
export const CROSS = 2;

export type PlayerColor = typeof CROSS | typeof NOUGHT;

const DRAW = 3;

export type EndType = typeof CROSS | typeof DRAW | typeof NOUGHT;

export const STATUS_PLAY_NOUGHT = "nought play";
export const STATUS_PLAY_CROSS = "cross play";
export const STATUS_WIN_NOUGHT = "nought win";
export const STATUS_WIN_CROSS = "cross win";
export const STATUS_DRAW = "draw";
export const STATUS_NONE = "none";

export type GameStatus =
  | typeof STATUS_DRAW
  | typeof STATUS_NONE
  | typeof STATUS_PLAY_CROSS
  | typeof STATUS_PLAY_NOUGHT
  | typeof STATUS_WIN_CROSS
  | typeof STATUS_WIN_NOUGHT;
