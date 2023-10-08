import { For, Match, Switch, createSignal, onMount } from "solid-js";

import { boardStyle, cellButtonStyle, cellStyle } from "@/styles/knight-tour.css";
import knight from "@/images/chess/knight-black.svg";
import cross from "@/images/symbol/cross-black.svg";
import circle from "@/images/symbol/circle-black.svg";
import { randomRange } from "@/scripts/random-select";

const CellUnvisited = 0;
const CellVisited = 1;
const CellKnight = 2;
const CellMovable = 3;

const BoardLength = 64;

export const App = () => {
  const [board, setBoard] = createSignal<number[]>([]);

  const reset = () => {
    const rand = randomRange(0, BoardLength);
    const board = Array.from({ length: BoardLength }, () => CellUnvisited);
    for (const index of getLegalMove(board, rand)) {
      if (board[index] === CellUnvisited) {
        board[index] = CellMovable;
      }
    }

    board[rand] = CellKnight;

    setBoard(board);
  };

  const handleClick = (index: number) => {
    setBoard((board) => {
      if (board[index] !== CellMovable) {
        return board;
      }

      const newBoard = board.map((cell) => {
        return cell === CellMovable ? CellUnvisited : cell;
      });

      const previousKnightIndex = newBoard.indexOf(CellKnight);

      for (const movableIndex of getLegalMove(newBoard, index)) {
        if (newBoard[movableIndex] === CellUnvisited) {
          newBoard[movableIndex] = CellMovable;
        }
      }

      newBoard[index] = CellKnight;
      newBoard[previousKnightIndex] = CellVisited;

      return newBoard;
    });
  };

  onMount(reset);

  return (
    <>
      <div class={boardStyle}>
        <For each={board()}>
          {(cell, index) => (
            <span class={cellStyle}>
              <button
                type="button"
                class={cellButtonStyle}
                onClick={() => {
                  handleClick(index());
                }}
              >
                <Switch>
                  <Match when={cell === CellVisited}>
                    <img src={cross.src} alt="visited" />
                  </Match>
                  <Match when={cell === CellMovable}>
                    <img src={circle.src} alt="movable" />
                    {getLegalMove(board(), index()).length}
                  </Match>
                  <Match when={cell === CellKnight}>
                    <img src={knight.src} alt="knight" />
                  </Match>
                </Switch>
              </button>
            </span>
          )}
        </For>
      </div>
    </>
  );
};

const getLegalMove = (board: number[], index: number): number[] => {
  /// . A . B .
  /// C . . . D
  /// . . N . .
  /// E . . . F
  /// . G . H .

  const currentKnightFile = index % 8;
  const currentKnightRank = Math.floor(index / 8);

  const moveSteps: [number, number][] = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [-1, 2],
    [1, -2],
    [-1, -2],
  ];

  return moveSteps
    .filter(
      ([x, y]) =>
        x - 1 < currentKnightRank &&
        currentKnightRank < 8 + x &&
        y - 1 < currentKnightFile &&
        currentKnightFile < 8 + y,
    )
    .map(([x, y]) => (currentKnightRank - x) * 8 + (currentKnightFile - y))
    .filter((index) => board[index] !== CellVisited && board[index] !== CellKnight);
};
