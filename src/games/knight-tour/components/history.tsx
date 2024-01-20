import { historyStyle } from "@/games/knight-tour/style.css";
import type { JSXElement } from "solid-js";
import { For } from "solid-js";

type HistoryProperties = {
  readonly history_: readonly number[];
  readonly back_: (index: number) => void;
};
export const History = (properties: HistoryProperties): JSXElement => {
  return (
    <ul class={historyStyle}>
      <For each={properties.history_}>
        {(fill, index) => (
          <li>
            {"abcdefgh"[fill % 8]}
            {Math.floor(fill / 8) + 1}
            <button
              type="button"
              onClick={() => {
                properties.back_(index());
              }}
            >
              back
            </button>
          </li>
        )}
      </For>
    </ul>
  );
};
