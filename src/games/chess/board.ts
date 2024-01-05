import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";
import { CellEmpty } from "./constants";

export type BoardCell = {
  readonly piece: number;
  readonly mark: number;
};

type BoardObject = {
  board: Accessor<readonly BoardCell[]>;
  setPiece: (pieces: readonly number[]) => void;
  setMark: (marks: readonly number[]) => void;
};

export const createBoard = (): BoardObject => {
  const [board, setBoard] = createSignal<readonly BoardCell[]>(
    Array.from({ length: 64 }, () => ({ piece: CellEmpty, mark: CellEmpty })),
  );

  const setPiece = (pieces: readonly number[]): void => {
    setBoard((previousBoard) => {
      return previousBoard.map((v, index) => ({ piece: pieces[index], mark: v.mark }) as BoardCell);
    });
  };

  const setMark = (marks: readonly number[]): void => {
    setBoard((previousBoard) => {
      return previousBoard.map((v, index) => ({ piece: v.piece, mark: marks[index] }) as BoardCell);
    });
  };

  return {
    board,
    setPiece,
    setMark,
  };
};
