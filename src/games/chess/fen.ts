import {
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
} from "./types";

import type { BoardData, EnPassantTarget, GameState, IsCastled, Mark, Square } from "./types";

const charsMap: Record<Square, string> = {
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
    (castling & 0b0010 ? "K" : "") +
      (castling & 0b0001 ? "Q" : "") +
      (castling & 0b1000 ? "k" : "") +
      (castling & 0b0100 ? "q" : "") || "-"
  );
};

const enPassantToFen = (enPassant: EnPassantTarget): string => {
  return enPassant === undefined ? "-" : indexToAlgebraic(enPassant);
};

const indexToAlgebraic = (index: number): string => {
  const rank = Math.floor(index / 8);
  const file = index % 8;

  return (["a", "b", "c", "d", "e", "f", "g", "h"][file] ?? "") + String(8 - rank);
};
