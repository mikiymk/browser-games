import type { Awaitable, Tuple, TupleIndex } from "@/common/type-util";

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
export const Resign = 136;

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
export type Resign = typeof Resign;

export type BoardData = Tuple<Piece | Empty, 64>;
export type Index = TupleIndex<BoardData>;

export type GameState = {
  board: BoardData;
  mark: Mark;
  castling: IsCastled;
  enPassant: EnPassantTarget;
  fiftyMove: number;
  threefold: Map<string, number>;
  moves: number;
};

//   |  a  b  c  d  e  f  g  h
// --+------------------------
// 8 |  0  1  2  3  4  5  6  7
// 7 |  8  9 10 11 12 13 14 15
// 6 | 16 17 18 19 20 21 22 23
// 5 | 24 25 26 27 28 29 30 31
// 4 | 32 33 34 35 36 37 38 39
// 3 | 40 41 42 43 44 45 46 47
// 2 | 48 49 50 51 52 53 54 55
// 1 | 56 57 58 59 60 61 62 63

type MoveTypeReset = { type: Reset };
type MoveTypeResign = { type: Resign };
export type MoveTypeMove = { type: Move; from: Index; to: Index };
export type MoveTypeCastling = { type: Castling; rook: 0 | 7 | 56 | 63 };
export type MoveTypeEnPassant = { type: EnPassant; from: Index; to: Index; capture: Index };
export type MoveTypePromotion = { type: Promotion; from: Index; to: Index; piece: Piece };

export type MoveTypes =
  | MoveTypeReset
  | MoveTypeResign
  | MoveTypeMove
  | MoveTypeCastling
  | MoveTypeEnPassant
  | MoveTypePromotion;

export type IsCastled = [
  black_queen_0: boolean,
  black_king_7: boolean,
  white_queen_56: boolean,
  white_king_64: boolean,
];

export type EnPassantTarget = Index | false;

export type InputType = Index | Reset;
type BlackPromotionTarget = typeof BlackKnight | typeof BlackBishop | typeof BlackRook | typeof BlackQueen;
type WhitePromotionTarget = typeof WhiteKnight | typeof WhiteBishop | typeof WhiteRook | typeof WhiteQueen;
export type PromotionPieces = BlackPromotionTarget | WhitePromotionTarget;

export type Sender<T> = (value: T) => void;
export type Receiver<T> = () => Promise<T>;

export type Player = {
  getMove(gameState: GameState): Awaitable<MoveTypes>;
};

export type Players = Record<Mark, Player>;
