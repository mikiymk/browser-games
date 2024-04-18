import type { MultiPromise } from "@/scripts/multi-promise";
import type { PlayerType } from "@/scripts/player";
import { PlayerTypeHuman } from "@/scripts/player";
import type { Setter } from "solid-js";
import { gameNoughtAndCrossAi } from "./ai";
import { Empty, MarkO, MarkX, Reset } from "./types";

type Players = { readonly o: PlayerType; readonly x: PlayerType };

const isHumanPlayer = (players: Players, mark: number): boolean => {
  return (mark === MarkO && players.o === PlayerTypeHuman) || (mark === MarkX && players.x === PlayerTypeHuman);
};

const move = (board: readonly number[], index: number, mark: number): readonly number[] => {
  return board.with(index, mark);
};

export const turnMark = (mark: number): number => {
  return mark === MarkX ? MarkO : MarkX;
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

export const isWin = (board: readonly number[], mark: number): boolean => {
  for (const line of rowIndexes) {
    if (line.every((index) => board[index] === mark)) {
      return true;
    }
  }

  return false;
};

export const filledBoard = (board: readonly number[]): boolean => {
  for (const cell of board) {
    if (cell === Empty) {
      return false;
    }
  }

  return true;
};

export const gameLoop = (
  setBoard: Setter<readonly number[]>,
  setMark: Setter<number>,
  setHistory: Setter<readonly number[]>,
  humanInput: MultiPromise<number>,
  players: Players,
): { terminate: () => void } => {
  let board: readonly number[] = Array.from({ length: 9 }, () => Empty);
  let mark = MarkO;
  let isRunning = true;

  const terminate = (): void => {
    isRunning = false;
  };

  setBoard(board);
  setMark(mark);
  setHistory([]);

  const run = async (): Promise<void> => {
    const index: number = isHumanPlayer(players, mark) ? await humanInput.request() : gameNoughtAndCrossAi(board, mark);

    if (index === Reset) {
      terminate();
      return;
    }

    board = move(board, index, mark);
    mark = turnMark(mark);

    setBoard(board);
    setMark(mark);
    setHistory((history) => [...history, index]);

    if (isWin(board, MarkO) || isWin(board, MarkX) || filledBoard(board)) {
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
