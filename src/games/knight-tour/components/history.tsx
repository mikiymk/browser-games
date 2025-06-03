import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import { HeaderPopup } from "../../../common/components/page-frame/header-popup.tsx";
import { TEXT_HISTORY } from "../../../common/scripts/constants.ts";
import { history, historyButton, historyItem } from "./style.css.ts";

type HistoryProperties = {
  readonly back: (index: number) => void;
  readonly history: readonly number[];
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
                class={historyButton}
                onClick={() => {
                  properties.back(index());
                }}
                type="button"
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
