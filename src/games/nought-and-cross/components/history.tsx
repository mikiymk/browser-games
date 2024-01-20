import { historyMoveStyle, historyStyle } from "@/games/nought-and-cross/style.css";
import type { JSXElement } from "solid-js";
import { For, Show } from "solid-js";

const historyFillArray = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

const position = (index: number): string => {
  return `${"ABC"[index % 3] ?? ""}-${Math.floor(index / 3)}`;
};

type HistoryProperties = {
  readonly history: readonly number[];
};
export const History = (properties: HistoryProperties): JSXElement => {
  const paddedHistory = (): number[] => [...properties.history, ...historyFillArray].slice(0, 9);

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
