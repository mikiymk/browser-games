export const WHITE_NUMBER = 0;
export const BLACK_NUMBER = 1;

export const WHITE = "white";
export const BLACK = "black";

export type PlayerColor = typeof BLACK | typeof WHITE;

export const DRAW = "draw";

export type EndType = typeof BLACK | typeof DRAW | typeof WHITE;

export const STATUS_PLAY_WHITE = "white play";
export const STATUS_PLAY_BLACK = "black play";
export const STATUS_WIN_WHITE = "white win";
export const STATUS_WIN_BLACK = "black win";
export const STATUS_DRAW = "draw";
export const STATUS_NONE = "none";

export type GameStatus =
  | typeof STATUS_DRAW
  | typeof STATUS_NONE
  | typeof STATUS_PLAY_BLACK
  | typeof STATUS_PLAY_WHITE
  | typeof STATUS_WIN_BLACK
  | typeof STATUS_WIN_WHITE;
