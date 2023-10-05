import type { Awaitable, Tuple } from "@/scripts/type";
import type { Accessor } from "solid-js";

export const Empty = -1;
export const OMark = 1;
export const XMark = 2;
export const Reset = 10;

export const winnerLines: [Index, Index, Index][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export type Mark = typeof OMark | typeof XMark;
export type Empty = typeof Empty;
export type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type BoardData = Tuple<Mark | Empty, 9>;

export type Player = {
  getMarkIndex(boardData: Accessor<BoardData>, mark: Mark): Awaitable<Index | typeof Reset>;
};

export type Players = Record<Mark, Player>;
