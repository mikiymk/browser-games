import { Accessor } from "solid-js";

// マスの状況
export const Empty = 100;
export const BlackPawn = 111;
export const BlackKnight = 112;
export const BlackBishop = 113;
export const BlackRook = 114;
export const BlackQueen = 115;
export const BlackKing = 116;

export const WhitePawn = 121;
export const WhiteKnight = 122;
export const WhiteBishop = 123;
export const WhiteRook = 124;
export const WhiteQueen = 125;
export const WhiteKing = 126;

export const Black = 110;
export const White = 120;

export const Reset = 131;
export const Move = 132;
export const Castling = 133;
export const EnPassant = 134;
export const Promotion = 135;

// 盤のサイズ
export const BoardLength = 64;

export type Mark = typeof Black | typeof White;
export type Piece =
  | typeof BlackPawn
  | typeof BlackKnight
  | typeof BlackBishop
  | typeof BlackRook
  | typeof BlackQueen
  | typeof BlackKing
  | typeof WhitePawn
  | typeof WhiteKnight
  | typeof WhiteBishop
  | typeof WhiteRook
  | typeof WhiteQueen
  | typeof WhiteKing;
export type Empty = typeof Empty;
export type Reset = typeof Reset;
export type Move = typeof Move;
export type Castling = typeof Castling;
export type EnPassant = typeof EnPassant;
export type Promotion = typeof Promotion;

export type Tuple<T, N, List extends T[] = []> = List["length"] extends N ? List : Tuple<T, N, [T, ...List]>;
export type BoardData = Tuple<Piece | Empty, 64>;
// prettier-ignore
export type Index = 
  | 0| 1| 2| 3| 4| 5| 6| 7
  | 8| 9|10|11|12|13|14|15
  |16|17|18|19|20|21|22|23
  |24|25|26|27|28|29|30|31
  |32|33|34|35|36|37|38|39
  |40|41|42|43|44|45|46|47
  |48|49|50|51|52|53|54|55
  |56|57|58|59|60|61|62|63;

export type Awaitable<T> = T | Promise<T>;
export type MoveTypes =
  | { type: Reset }
  | { type: Move; from: Index; to: Index }
  | { type: Castling; rook: 0 | 7 | 56 | 63 }
  | { type: EnPassant; from: Index; to: Index; capture: Index }
  | { type: Promotion; from: Index; to: Index; piece: Piece };
export type Player = {
  getMove(boardData: Accessor<BoardData>, mark: Mark): Awaitable<MoveTypes>;
};

export type Players = Record<Mark, Player>;
