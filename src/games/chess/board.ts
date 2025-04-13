import type { Accessor } from "solid-js";

import { createSignal } from "solid-js";

import { CellEmpty } from "./constants.ts";

export type BoardCell = {
  readonly mark: number;
  readonly piece: number;
};

type BoardObject = {
  board: Accessor<readonly BoardCell[]>;
  setMark: (marks: readonly number[]) => void;
  setPiece: (pieces: readonly number[]) => void;
};

export const createBoard = (): BoardObject => {
  const [board, setBoard] = createSignal<readonly BoardCell[]>(
    Array.from({ length: 64 }, () => ({ mark: CellEmpty, piece: CellEmpty })),
  );

  const setPiece = (pieces: readonly number[]): void => {
    setBoard((previousBoard) => {
      return previousBoard.map((v, index) => ({ mark: v.mark, piece: pieces[index] }) as BoardCell);
    });
  };

  const setMark = (marks: readonly number[]): void => {
    setBoard((previousBoard) => {
      return previousBoard.map((v, index) => ({ mark: marks[index], piece: v.piece }) as BoardCell);
    });
  };

  return {
    board,
    setMark,
    setPiece,
  };
};
