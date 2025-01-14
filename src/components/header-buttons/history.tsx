import { HeaderPopup } from "@/components/page-header/header-popup";
import { TEXT_HISTORY } from "@/scripts/constants";
import type { JSXElement } from "solid-js";
import { For } from "solid-js";
import { Button } from "../button";

type HistoryProperties = {
  readonly history: readonly string[];
  readonly handleClick: (index: number) => void;
};
export const History = (properties: HistoryProperties): JSXElement => {
  return (
    <HeaderPopup icon="history" label={TEXT_HISTORY}>
      <h2>{TEXT_HISTORY}</h2>
      <ol class="list-inside list-decimal">
        <For each={properties.history}>
          {(history, index) => (
            <li class="w-32 m-auto text-left bg-yellow-100">
              <Button
                onClick={() => {
                  properties.handleClick(index());
                }}
              >
                {history}
              </Button>
            </li>
          )}
        </For>
      </ol>
    </HeaderPopup>
  );
};
