import type { JSXElement } from "solid-js";
import { For } from "solid-js";
import { HeaderPopup } from "../../../components/page/header-popup.tsx";
import { TEXT_HISTORY } from "../../../scripts/constants.ts";
import { history, historyButton, historyItem } from "./style.css.ts";

type HistoryProperties = {
  readonly history: readonly number[];
  readonly back: (index: number) => void;
};
export const History = (properties: HistoryProperties): JSXElement => {
  return (
    <HeaderPopup icon="history" label={TEXT_HISTORY}>
      <ul class={history}>
        <li>{TEXT_HISTORY}</li>
        <For each={properties.history}>
          {(fill, index) => (
            <li class={historyItem}>
              <button
                type="button"
                onClick={() => {
                  properties.back(index());
                }}
                class={historyButton}
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
