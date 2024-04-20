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
    <div class="space-x-2">
      <span>History</span>
      <For each={paddedHistory()}>
        {(history) => (
          <span class="inline-block w-12 px-2 text-center bg-lime-200">
            <Show when={history !== -1}>{position(history)}</Show>
          </span>
        )}
      </For>
    </div>
  );
};
