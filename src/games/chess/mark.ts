import {
  Black,
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  Empty,
  White,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "@/games/chess/types";

import type { Mark, Square } from "@/games/chess/types";

export const invertMark = (mark: Mark) => {
  return mark === Black ? White : Black;
};

export const getMark = (piece: Square): Mark | Empty => {
  switch (piece) {
    case WhitePawn:
    case WhiteKnight:
    case WhiteBishop:
    case WhiteRook:
    case WhiteQueen:
    case WhiteKing: {
      return White;
    }

    case BlackPawn:
    case BlackKnight:
    case BlackBishop:
    case BlackRook:
    case BlackQueen:
    case BlackKing: {
      return Black;
    }

    case Empty: {
      return Empty;
    }
  }
};
