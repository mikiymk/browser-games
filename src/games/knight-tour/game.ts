import { createSignal, onMount } from "solid-js";

import { randomRange } from "../../common/scripts/random-select.ts";
import { BoardLength, CellKnight, CellMovable, CellUnvisited, CellVisited } from "./constants.ts";
import { setKnightMovable } from "./knight-move.ts";

import type { Accessor } from "solid-js";

type GameObject = {
  backHistory: (index: number) => void;
  board: Accessor<readonly number[]>;
  handleClick: (index: number) => void;
  history: Accessor<readonly number[]>;
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

  const handleClick = (index: number): void => {
    if (board()[index] !== CellMovable) {
      return;
    }

    setHistory((history) => [...history, index]);
    resetBoard((board) => {
      const previousKnightIndex = board.indexOf(CellKnight);

      return setKnightMovable(board, index).with(previousKnightIndex, CellVisited);
    });
  };

  onMount(reset);

  return {
    backHistory,
    board,
    handleClick,
    history,
  };
};
