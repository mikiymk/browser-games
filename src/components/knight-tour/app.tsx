import { For, Match, Switch, createSignal, onMount } from "solid-js";

import { boardStyle, cellButtonStyle, cellStyle } from "@/styles/knight-tour.css";
import knight from "@/images/chess/knight-black.svg";
import cross from "@/images/symbol/cross-black.svg";
import { randomRange } from "@/scripts/random-select";

const CellUnvisited = 0;
const CellVisited = 1;
const CellKnight = 2;

const BoardLength = 64;

export const App = () => {
  const [board, setBoard] = createSignal<number[]>([]);

  const reset = () => {
    const rand = randomRange(0, BoardLength);
    const board = Array.from({ length: BoardLength }, () => CellUnvisited);
    board[rand] = CellKnight;

    setBoard(board);
  };

  const handleClick = (index: number) => {
    setBoard((board) => {
      const newBoard = [...board];

      const previousKnightIndex = newBoard.indexOf(CellKnight);

      newBoard[previousKnightIndex] = CellVisited;
      newBoard[index] = CellKnight;

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
                  console.log(`click ${index()}`);
                  handleClick(index());
                }}
              >
                <Switch>
                  <Match when={cell === CellVisited}>
                    <img src={cross.src} alt="visited" />
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
