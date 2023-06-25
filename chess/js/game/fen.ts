import type { BoardData, Mark, IsCastled, Index, Piece, GameState, EnPassantTarget } from "../types";

import {
  Empty,
  White,
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "../types";

const charsMap: Record<Piece | Empty, string> = {
  [Empty]: "E",
  [BlackPawn]: "p",
  [BlackKnight]: "n",
  [BlackBishop]: "b",
  [BlackRook]: "r",
  [BlackQueen]: "q",
  [BlackKing]: "k",
  [WhitePawn]: "P",
  [WhiteKnight]: "N",
  [WhiteBishop]: "B",
  [WhiteRook]: "R",
  [WhiteQueen]: "Q",
  [WhiteKing]: "K",
};

export const stateToFen = (state: GameState): string => {
  return `${boardToFen(state.board)} ${markToFen(state.mark)} ${castlingToFen(state.castling)} ${enPassantToFen(
    state.enPassant,
  )} ${state.fiftyMove} ${state.moves}`;
};

export const boardToFen = (board: BoardData): string => {
  let emptyCount = 0;
  const stringArray: string[] = [];
  for (const [index, square] of board.entries()) {
    if (index % 8 === 0) {
      if (emptyCount !== 0) {
        stringArray.push(String(emptyCount));
      }
      emptyCount = 0;
      stringArray.push("/");
    }
    if (square === Empty) {
      emptyCount++;
    } else {
      if (emptyCount !== 0) {
        stringArray.push(String(emptyCount));
      }
      emptyCount = 0;
      stringArray.push(charsMap[square]);
    }
  }

  if (emptyCount !== 0) {
    stringArray.push(String(emptyCount));
  }

  return stringArray.slice(1).join("");
};

export const markToFen = (mark: Mark): string => {
  return mark === White ? "w" : "b";
};

const castlingToFen = (castling: IsCastled): string => {
  return (
    (castling[3] ? "K" : "") + (castling[2] ? "Q" : "") + (castling[1] ? "k" : "") + (castling[0] ? "q" : "") || "-"
  );
};

const enPassantToFen = (enPassant: EnPassantTarget): string => {
  return enPassant === false ? "-" : indexToAlgebraic(enPassant);
};

const indexToAlgebraic = (index: Index): string => {
  const rank = Math.floor(index / 8);
  const file = index % 8;

  return (["a", "b", "c", "d", "e", "f", "g", "h"][file] ?? "") + String(8 - rank);
};
