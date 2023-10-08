import { For, Match, Show, Switch, createMemo, createSignal, onMount } from "solid-js";

import { boardStyle, cellButtonStyle, cellStyle } from "@/styles/knight-tour.css";
import knight from "@/images/chess/knight-black.svg";
import cross from "@/images/symbol/cross-black.svg";
import circle from "@/images/symbol/circle-black.svg";
import number0 from "@/images/number/0-black.svg";
import number1 from "@/images/number/1-black.svg";
import number2 from "@/images/number/2-black.svg";
import number3 from "@/images/number/3-black.svg";
import number4 from "@/images/number/4-black.svg";
import number5 from "@/images/number/5-black.svg";
import number6 from "@/images/number/6-black.svg";
import number7 from "@/images/number/7-black.svg";
import number8 from "@/images/number/8-black.svg";
import { randomRange } from "@/scripts/random-select";

const CellUnvisited = 0;
const CellVisited = 1;
const CellKnight = 2;
const CellMovable = 3;

const BoardLength = 64;

export const App = () => {
  const [board, setBoard] = createSignal<number[]>([]);
  const [hintMode, setHintMode] = createSignal(false);
  const [history, setHistory] = createSignal<number[]>([]);

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
    setHistory([]);
  };

  const handleClick = (index: number) => {
    setHistory((history) => [...history, index]);
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

  const backHistory = (index: number) => {
    const currentHistory = history();

    setHistory(currentHistory.slice(0, index));
    setBoard((board) => {
      const newBoard: number[] = board.map((cell) => {
        return cell === CellVisited ? CellVisited : CellUnvisited;
      });

      for (const historyIndex of currentHistory.slice(index)) {
        newBoard[historyIndex] = CellUnvisited;
      }

      const knightIndex = currentHistory[index - 1] ?? newBoard.indexOf(CellVisited);

      for (const index of getLegalMove(newBoard, knightIndex)) {
        if (newBoard[index] === CellUnvisited) {
          newBoard[index] = CellMovable;
        }
      }

      newBoard[knightIndex] = CellKnight;

      return newBoard;
    });
  };

  onMount(reset);

  return (
    <>
      <div class={boardStyle}>
        <For each={board()}>
          {(cell, index) => {
            const getMovableCount = createMemo(() => getLegalMove(board(), index()).length);

            return (
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
                      <Show when={hintMode()} fallback={<img src={circle.src} alt="movable" />}>
                        <Switch>
                          <Match when={getMovableCount() === 0}>
                            <img src={number0.src} alt="movable 0" />
                          </Match>
                          <Match when={getMovableCount() === 1}>
                            <img src={number1.src} alt="movable 1" />
                          </Match>
                          <Match when={getMovableCount() === 2}>
                            <img src={number2.src} alt="movable 2" />
                          </Match>
                          <Match when={getMovableCount() === 3}>
                            <img src={number3.src} alt="movable 3" />
                          </Match>
                          <Match when={getMovableCount() === 4}>
                            <img src={number4.src} alt="movable 4" />
                          </Match>
                          <Match when={getMovableCount() === 5}>
                            <img src={number5.src} alt="movable 5" />
                          </Match>
                          <Match when={getMovableCount() === 6}>
                            <img src={number6.src} alt="movable 6" />
                          </Match>
                          <Match when={getMovableCount() === 7}>
                            <img src={number7.src} alt="movable 7" />
                          </Match>
                          <Match when={getMovableCount() === 8}>
                            <img src={number8.src} alt="movable 8" />
                          </Match>
                        </Switch>
                      </Show>
                    </Match>
                    <Match when={cell === CellKnight}>
                      <img src={knight.src} alt="knight" />
                    </Match>
                  </Switch>
                </button>
              </span>
            );
          }}
        </For>
      </div>

      <div>
        <h2>Settings</h2>

        <button type="button" onClick={() => setHintMode((hint) => !hint)}>
          Show Warnsdorff's hint
        </button>
      </div>

      <div>
        <h2>History</h2>

        <ul>
          <For each={history()}>
            {(fill, index) => (
              <li>
                {"abcdefgh"[fill % 8]}
                {Math.floor(fill / 8)}
                <button
                  type="button"
                  onClick={() => {
                    backHistory(index());
                  }}
                >
                  back
                </button>
              </li>
            )}
          </For>
        </ul>
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
