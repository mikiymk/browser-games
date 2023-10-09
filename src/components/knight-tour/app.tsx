import { For, Show, createSignal, onMount } from "solid-js";

import { CellKnight, CellMovable, CellVisited } from "@/games/knight-tour/consts";
import { createGame } from "@/games/knight-tour/create-game";
import { setKnightMovable } from "@/games/knight-tour/knight-move";
import { boardStyle, cellButtonStyle, cellStyle } from "@/styles/knight-tour.css";

import { History } from "./history";
import { Square } from "./square";

export const App = () => {
  const { board, resetBoard, reset, history, setHistory } = createGame();
  const [hintMode, setHintMode] = createSignal(false);

  const handleClick = (index: number) => {
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
                <Square board={board()} cell={cell} index={index()} hintMode={hintMode()} />
              </button>
            </span>
          )}
        </For>
      </div>

      <div>
        <h2>Settings</h2>

        <Show when={hintMode()}>☑</Show>
        <button type="button" onClick={() => setHintMode((hint) => !hint)}>
          Show Warnsdorff's hint
        </button>
      </div>

      <History history={history()} setHistory={setHistory} resetBoard={resetBoard} />
    </>
  );
};
