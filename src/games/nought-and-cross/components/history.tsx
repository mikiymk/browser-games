import { HeaderPopup } from "@/components/page-header/header-popup";
import { StyledSvg } from "@/components/styled-svg";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import type { JSXElement } from "solid-js";
import { For, Show } from "solid-js";

const historyFillArray = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

const position = (index: number): string => {
  return `${"ABC"[index % 3] ?? ""}-${Math.floor(index / 3) + 1}`;
};

type HistoryProperties = {
  readonly history: readonly number[];
};
export const History = (properties: HistoryProperties): JSXElement => {
  const paddedHistory = (): number[] => [...properties.history, ...historyFillArray].slice(0, 9);

  return (
    <HeaderPopup icon="history" label="History">
      <h2>History</h2>
      <ol class="list-inside list-decimal">
        <For each={paddedHistory()}>
          {(history, index) => (
            <li class="w-32 m-auto text-left bg-yellow-100">
              <Show when={index() % 2} fallback={<StyledSvg src={nought.src} alt="nought" />}>
                <StyledSvg src={cross.src} alt="cross" />
              </Show>
              <Show when={history !== -1}>{position(history)}</Show>
            </li>
          )}
        </For>
      </ol>
    </HeaderPopup>
  );
};
