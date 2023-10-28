import { CellEmpty } from "@/components/reversi/const";
import { PlayerTypeHuman } from "@/scripts/player";

import { gameNoughtAndCrossAi } from "./ai";
import { OMark, Reset, XMark } from "./types";

import type { MultiPromise } from "@/scripts/multi-promise";
import type { Setter } from "solid-js";

type Players = { O: number; X: number };

export const gameLoop = (
  setBoard: Setter<number[]>,
  setMark: Setter<number>,
  setHistory: Setter<number[]>,
  humanInput: MultiPromise<number>,
  players: Players,
) => {
  const id = Math.floor(Math.random() * 0xff_ff).toString(16);

  console.log(`start game(${id})`);

  const board = Array.from({ length: 9 }, () => CellEmpty);
  let mark = OMark;
  let isRunning = true;

  const terminate = () => {
    console.log(`end game(${id})`);

    isRunning = false;
  };

  setBoard([...board]);
  setMark(mark);
  setHistory([]);

  const run = async () => {
    const index: number = isHumanPlayer(players, mark) ? await humanInput.request() : gameNoughtAndCrossAi(board, mark);

    if (index === Reset) {
      terminate();
      return;
    }

    move(board, index, mark);
    mark = turnMark(mark);

    setBoard([...board]);
    setMark(mark);
    setHistory((history) => [...history, index]);

    if (isWin(board, OMark) || isWin(board, XMark) || filledBoard(board)) {
      terminate();
    }

    if (isRunning) {
      setTimeout(() => {
        void run();
      }, 0);
    }
  };

  setTimeout(() => {
    void run();
  }, 0);

  return {
    terminate,
  };
};

export const isHumanPlayer = (players: Players, mark: number): boolean => {
  return (mark === OMark && players.O === PlayerTypeHuman) || (mark === XMark && players.X === PlayerTypeHuman);
};

export const move = (board: number[], index: number, mark: number) => {
  board[index] = mark;
};

export const turnMark = (mark: number): number => {
  return mark === XMark ? OMark : XMark;
};

const rowIndexes: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const isWin = (board: number[], mark: number): boolean => {
  for (const line of rowIndexes) {
    if (line.every((index) => board[index] === mark)) {
      return true;
    }
  }

  return false;
};

export const filledBoard = (board: number[]): boolean => {
  for (const cell of board) {
    if (cell === CellEmpty) {
      return false;
    }
  }

  return true;
};
