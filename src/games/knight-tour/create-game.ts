import { createSignal } from "solid-js";

import { BoardLength, CellMovable, CellUnvisited } from "@/games/knight-tour/consts";
import { setKnightMovable } from "@/games/knight-tour/knight-move";
import { randomRange } from "@/scripts/random-select";

export const createGame = () => {
  const [board, setBoard] = createSignal<number[]>([]);
  const [history, setHistory] = createSignal<number[]>([]);

  const resetBoard = (callback: (board: number[]) => number[]) => {
    setBoard((board) => {
      const newBoard = board.map((cell) => {
        return cell === CellMovable ? CellUnvisited : cell;
      });

      return callback(newBoard);
    });
  };

  const reset = () => {
    const rand = randomRange(0, BoardLength);
    const board = Array.from({ length: BoardLength }, () => CellUnvisited);

    setBoard(setKnightMovable(board, rand));
    setHistory([]);
  };

  return {
    board,
    resetBoard,
    reset,
    history,
    setHistory,
  };
};
