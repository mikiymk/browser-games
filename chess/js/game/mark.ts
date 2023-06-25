import {
  Black,
  White,
  Empty,
  WhitePawn,
  WhiteKnight,
  WhiteBishop,
  WhiteRook,
  WhiteQueen,
  WhiteKing,
  BlackPawn,
  BlackKnight,
  BlackBishop,
  BlackRook,
  BlackQueen,
  BlackKing,
} from "@/chess/js/types";

import type { Mark, Piece } from "@/chess/js/types";

export const invertMark = (mark: Mark) => {
  return mark === Black ? White : Black;
};

export const getMark = (piece: Piece | Empty): Mark | Empty => {
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
