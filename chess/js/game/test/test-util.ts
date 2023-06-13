import { BoardData, BoardLength, Empty, Index, Piece } from "../../types";

export const generateBoard = (pieces: Partial<Record<Index, Piece>>): BoardData => {
  return Array.from<never, Piece | Empty>(
    { length: BoardLength },
    (_, key) => pieces[key as Index] ?? Empty,
  ) as BoardData;
};
