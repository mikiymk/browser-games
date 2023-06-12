import {
  Mark,
  Black,
  White,
  Piece,
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
  BoardData,
  Index,
} from "../types";

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

export const isSameMark = (board: BoardData, from: Index, to: Index): boolean => {
  const fromMark = getMark(board[from]);
  const toMark = getMark(board[to]);

  if (fromMark === Empty || toMark === Empty) return false;
  return fromMark === toMark;
};

export const isOtherMark = (board: BoardData, from: Index, to: Index): boolean => {
  const fromMark = getMark(board[from]);
  const toMark = getMark(board[to]);

  if (fromMark === Empty || toMark === Empty) return false;
  return fromMark !== toMark;
};
