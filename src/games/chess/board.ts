import { createSignal } from "solid-js";

import { CellEmpty } from "./constants";

export type BoardCell = {
  piece: number;
  mark: number;
};

export const createBoard = () => {
  const [board, setBoard] = createSignal<BoardCell[]>(
    Array.from({ length: 64 }, () => ({ piece: CellEmpty, mark: CellEmpty })),
  );

  const setPiece = (pieces: number[]) => {
    setBoard((previousBoard) => {
      return previousBoard.map((v, index) => ({ piece: pieces[index], mark: v.mark }) as BoardCell);
    });
  };

  const setMark = (marks: number[]) => {
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
