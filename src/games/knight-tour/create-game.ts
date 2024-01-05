import { BoardLength, CellMovable, CellUnvisited, CellVisited } from "@/games/knight-tour/consts";
import { setKnightMovable } from "@/games/knight-tour/knight-move";
import { randomRange } from "@/scripts/random-select";
import type { Accessor, Setter } from "solid-js";
import { createSignal } from "solid-js";

type GameObject = {
  board: Accessor<readonly number[]>;
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  resetBoard: (callback: (board: number[]) => number[]) => void;
  reset: () => void;
  history: Accessor<readonly number[]>;
  setHistory: Setter<readonly number[]>;
  backHistory: (index: number) => void;
};

export const createGame = (): GameObject => {
  const [board, setBoard] = createSignal<readonly number[]>([]);
  const [history, setHistory] = createSignal<readonly number[]>([]);

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const resetBoard = (callback: (board: number[]) => number[]): void => {
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
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    resetBoard((board) => {
      for (const historyIndex of currentHistory.slice(index)) {
        board[historyIndex] = CellUnvisited;
      }

      const knightIndex = currentHistory[index - 1] ?? board.indexOf(CellVisited);

      return setKnightMovable(board, knightIndex);
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
