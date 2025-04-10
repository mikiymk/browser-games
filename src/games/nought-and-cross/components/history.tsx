import type { JSXElement } from "solid-js";
import { For, Show } from "solid-js";
import { StyledSvg } from "../../../components/elements/styled-svg.tsx";
import { HeaderPopup } from "../../../components/page/header-popup.tsx";
import cross from "../../../images/icon/cross.svg";
import nought from "../../../images/icon/nought.svg";
import { TEXT_HISTORY } from "../../../scripts/constants.ts";
import { history, historyItem } from "./style.css.ts";

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
    <HeaderPopup icon="history" label={TEXT_HISTORY}>
      <h2>{TEXT_HISTORY}</h2>
      <ol class={history}>
        <For each={paddedHistory()}>
          {(history, index) => (
            <li class={historyItem}>
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
