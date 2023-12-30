import { historyMoveStyle, historyStyle } from "@/styles/nought-and-cross.css";
import { For, Show } from "solid-js";

const historyFillArray = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

type HistoryProperties = {
  history: number[];
};
export const History = (properties: HistoryProperties) => {
  const paddedHistory = () => [...properties.history, ...historyFillArray].slice(0, 9);

  return (
    <div class={historyStyle}>
      <span>History</span>
      <For each={paddedHistory()}>
        {(history) => (
          <span class={historyMoveStyle}>
            <Show when={history !== -1}>{position(history)}</Show>
          </span>
        )}
      </For>
    </div>
  );
};

const position = (index: number): string => {
  return `${"ABC"[index % 3] ?? ""}-${Math.floor(index / 3)}`;
};
