import { For } from "solid-js";

import { historyStyle } from "@/styles/knight-tour.css";

type HistoryProperties = {
  history_: number[];
  back_: (index: number) => void;
};
export const History = (properties: HistoryProperties) => {
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
