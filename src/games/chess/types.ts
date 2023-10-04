import type { Awaitable, Tuple, TupleIndex } from "@/scripts/type";

// マスの状況
export type Square = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export const Empty = 0;

export const WhitePawn = 1;
export const WhiteKnight = 2;
export const WhiteBishop = 3;
export const WhiteRook = 4;
export const WhiteQueen = 5;
export const WhiteKing = 6;

export const BlackPawn = 7;
export const BlackKnight = 8;
export const BlackBishop = 9;
export const BlackRook = 10;
export const BlackQueen = 11;
export const BlackKing = 12;

export type Mark = 0 | 1;
export const Black = 1;
export const White = 0;

export const Reset = "reset";
const Move = "m";
const Castling = "c";
const EnPassant = "e";
const Promotion = "p";
export const Resign = "resign";

// 盤のサイズ
export const BoardLength = 64;

export type Empty = typeof Empty;
export type Reset = typeof Reset;
type Move = typeof Move;
type Castling = typeof Castling;
type EnPassant = typeof EnPassant;
type Promotion = typeof Promotion;
export type Resign = typeof Resign;

export type BoardData = Tuple<Square, 64>;
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

export type PositionFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type PositionRank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type PositionString = `${PositionFile}${PositionRank}`;
export type WasmPiece = "P" | "N" | "B" | "R" | "Q" | "K";

type MoveTypeReset = [Reset];
type MoveTypeResign = [Resign];
export type MoveTypeMove = [Move, PositionString, PositionString];
export type MoveTypeCastling = [Castling, PositionString, PositionString];
export type MoveTypeEnPassant = [EnPassant, PositionString, PositionString, PositionString];
export type MoveTypePromotion = [Promotion, PositionString, PositionString, WasmPiece];

export type MoveTypes =
  | MoveTypeReset
  | MoveTypeResign
  | MoveTypeMove
  | MoveTypeCastling
  | MoveTypeEnPassant
  | MoveTypePromotion;

export type IsCastled = number;

export type EnPassantTarget = number | undefined;

export type InputType = Index | Reset;
export type PromotionPieces = "N" | "B" | "R" | "Q";

export type Sender<T> = (value: T) => void;
export type Receiver<T> = () => Promise<T>;

export type Player = {
  getMove(gameState: GameState): Awaitable<MoveTypes>;
};

export type Players = Record<Mark, Player>;
