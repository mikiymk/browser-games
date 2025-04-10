import type { Accessor, Setter } from "solid-js";
import { createSignal } from "solid-js";
import { randomRange } from "../../scripts/random-select.ts";
import { BoardLength, CellMovable, CellUnvisited, CellVisited } from "./consts.ts";
import { setKnightMovable } from "./knight-move.ts";

type GameObject = {
  board: Accessor<readonly number[]>;
  resetBoard: (callback: (board: readonly number[]) => readonly number[]) => void;
  reset: () => void;
  history: Accessor<readonly number[]>;
  setHistory: Setter<readonly number[]>;
  backHistory: (index: number) => void;
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
    board,
    resetBoard,
    reset,
    history,
    setHistory,
    backHistory,
  };
};
