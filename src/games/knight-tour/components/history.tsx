import { HeaderPopup } from "@/components/page/header-popup";
import { TEXT_HISTORY } from "@/scripts/constants";
import type { JSXElement } from "solid-js";
import { For } from "solid-js";
import Styles from "./style.module.css";

type HistoryProperties = {
  readonly history: readonly number[];
  readonly back: (index: number) => void;
};
export const History = (properties: HistoryProperties): JSXElement => {
  return (
    <HeaderPopup icon="history" label={TEXT_HISTORY}>
      <ul class={Styles.history}>
        <li>{TEXT_HISTORY}</li>
        <For each={properties.history}>
          {(fill, index) => (
            <li class={Styles["history-item"]}>
              <button
                type="button"
                onClick={() => {
                  properties.back(index());
                }}
                class={Styles["history-button"]}
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
