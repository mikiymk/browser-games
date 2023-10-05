import { For, Match, Switch, createSignal } from "solid-js";

import { boardStyle, cellButtonStyle, cellStyle } from "@/styles/knight-tour.css";

const CellUnvisited = 0;
const CellVisited = 1;
const CellKnight = 2;

export const App = () => {
  const [board, setBoard] = createSignal(Array.from({ length: 64 }, (_, index) => index % 3));

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
                  setBoard((board) => {
                    const newBoard = [...board];

                    newBoard[index()] = (cell + 1) % 3;

                    return newBoard;
                  });
                }}
              >
                <Switch>
                  <Match when={cell === CellVisited}>✗</Match>
                  <Match when={cell === CellKnight}>♞</Match>
                </Switch>
              </button>
            </span>
          )}
        </For>
      </div>
    </>
  );
};
