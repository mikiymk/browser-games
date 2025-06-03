import type { Accessor, Setter } from "solid-js";

import { createSignal } from "solid-js";

import { randomRange } from "../../common/scripts/random-select.ts";
import { BoardLength, CellMovable, CellUnvisited, CellVisited } from "./consts.ts";
import { setKnightMovable } from "./knight-move.ts";

type GameObject = {
  backHistory: (index: number) => void;
  board: Accessor<readonly number[]>;
  history: Accessor<readonly number[]>;
  reset: () => void;
  resetBoard: (callback: (board: readonly number[]) => readonly number[]) => void;
  setHistory: Setter<readonly number[]>;
};

export const createGame = (): GameObject => {
  const [board, setBoard] = createSignal<readonly number[]>([]);
  const [history, setHistory] = createSignal<readonly number[]>([]);

  const resetBoard = (callback: (board: readonly number[]) => readonly number[]): void => {
    setBoard((board) => {
      const newBoard = board.map((cell) => {
        return cell === CellMovable ? CellUnvisited : cell;
      });

      return callback(newBoard);
    });
  };

  const reset = (): void => {
    const rand = randomRange(0, BoardLength);
    const board = Array.from({ length: BoardLength }, () => CellUnvisited);

    setBoard(setKnightMovable(board, rand));
    setHistory([]);
  };

  const backHistory = (index: number): void => {
    const currentHistory = history();

    setHistory(currentHistory.slice(0, index));
    resetBoard((board) => {
      const newBoard = [...board];
      for (const historyIndex of currentHistory.slice(index)) {
        newBoard[historyIndex] = CellUnvisited;
      }

      const knightIndex = currentHistory[index - 1] ?? newBoard.indexOf(CellVisited);

      return setKnightMovable(newBoard, knightIndex);
    });
  };

  return {
    backHistory,
    board,
    history,
    reset,
    resetBoard,
    setHistory,
  };
};
