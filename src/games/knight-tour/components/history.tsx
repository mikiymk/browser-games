import type { JSXElement } from "solid-js";
import { For } from "solid-js";

type HistoryProperties = {
  readonly history_: readonly number[];
  readonly back_: (index: number) => void;
};
export const History = (properties: HistoryProperties): JSXElement => {
  return (
    <ul class="space-x-2 text-start">
      <li>History</li>
      <For each={properties.history_}>
        {(fill, index) => (
          <li class="inline">
            <button
              type="button"
              onClick={() => {
                properties.back_(index());
              }}
              class="w-8 text-center border border-slate-900 border-solid"
            >
              {"abcdefgh"[fill % 8]}-{Math.floor(fill / 8) + 1}
            </button>
          </li>
        )}
      </For>
    </ul>
  );
};
