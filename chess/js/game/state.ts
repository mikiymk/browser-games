import {
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  BoardLength,
  Empty,
  White,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "@/chess/js/types";

import type { BoardData, GameState, Index, Square } from "@/chess/js/types";

export const generateState = (): GameState => {
  const board = generateBoard({
    0: BlackRook,
    1: BlackKnight,
    2: BlackBishop,
    3: BlackQueen,
    4: BlackKing,
    5: BlackBishop,
    6: BlackKnight,
    7: BlackRook,

    8: BlackPawn,
    9: BlackPawn,
    10: BlackPawn,
    11: BlackPawn,
    12: BlackPawn,
    13: BlackPawn,
    14: BlackPawn,
    15: BlackPawn,

    48: WhitePawn,
    49: WhitePawn,
    50: WhitePawn,
    51: WhitePawn,
    52: WhitePawn,
    53: WhitePawn,
    54: WhitePawn,
    55: WhitePawn,

    56: WhiteRook,
    57: WhiteKnight,
    58: WhiteBishop,
    59: WhiteQueen,
    60: WhiteKing,
    61: WhiteBishop,
    62: WhiteKnight,
    63: WhiteRook,
  });

  return {
    board,
    mark: White,
    castling: [true, true, true, true],
    enPassant: undefined,
    fiftyMove: 0,
    threefold: new Map(),
    moves: 1,
  };
};

export const generateBoard = (pieces: Partial<Record<Index, Square>>): BoardData => {
  return Array.from<never, Square>({ length: BoardLength }, (_, key) => {
    const piece = pieces[key as Index];
    return piece ?? Empty;
  }) as BoardData;
};
