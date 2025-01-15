import { HeaderPopup } from "@/components/page-header/header-popup";
import { TEXT_HISTORY } from "@/scripts/constants";
import type { JSXElement } from "solid-js";
import { For } from "solid-js";

type HistoryProperties = {
  readonly history: readonly number[];
  readonly back: (index: number) => void;
};
export const History = (properties: HistoryProperties): JSXElement => {
  return (
    <HeaderPopup icon="history" label={TEXT_HISTORY}>
      <ul class="space-x-2 text-start">
        <li>{TEXT_HISTORY}</li>
        <For each={properties.history}>
          {(fill, index) => (
            <li class="inline">
              <button
                type="button"
                onClick={() => {
                  properties.back(index());
                }}
                class="w-16 text-center border border-slate-900 border-solid"
              >
                {"abcdefgh"[fill % 8]}-{Math.floor(fill / 8) + 1}
              </button>
            </li>
          )}
        </For>
      </ul>
    </HeaderPopup>
  );
};
