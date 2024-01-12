import { CellKnight, CellMovable, CellVisited } from "@/games/knight-tour/consts";
import { createGame } from "@/games/knight-tour/create-game";
import { setKnightMovable } from "@/games/knight-tour/knight-move";
import checked from "@/images/symbol/checkbox-checked.svg";
import unchecked from "@/images/symbol/checkbox.svg";
import {
  boardStyle,
  cellButtonStyle,
  cellStyle,
  h2Style,
  settingCheckStyle,
  settingStyle,
} from "@/styles/knight-tour.css";
import type { JSXElement } from "solid-js";
import { For, Show, createSignal, onMount } from "solid-js";
import { History } from "./history";
import { Square } from "./square";

export const App = (): JSXElement => {
  const { board, history, resetBoard, reset, setHistory, backHistory } = createGame();
  const [hintMode, setHintMode] = createSignal(false);

  const handleClick = (index: number): void => {
    if (board()[index] !== CellMovable) {
      return;
    }

    setHistory((history) => [...history, index]);
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
                style={{
                  cursor: cell === CellMovable ? "pointer" : "default",
                }}
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

      <div class={settingStyle}>
        <h2 class={h2Style}>Settings</h2>

        <label>
          <Show
            when={hintMode()}
            fallback={<img class={settingCheckStyle} src={unchecked.src} alt="hint mode disabled" />}
          >
            <img class={settingCheckStyle} src={checked.src} alt="hint mode enabled" />
          </Show>
          <button type="button" onClick={() => setHintMode((hint) => !hint)}>
            Show Warnsdorff's hint
          </button>
        </label>
      </div>

      <History history_={history()} back_={backHistory} />
    </>
  );
};
