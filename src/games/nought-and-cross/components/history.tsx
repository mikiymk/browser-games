import { HeaderButton } from "@/components/page-header/header-button";
import { StyledSvg } from "@/components/styled-svg";
import { PopUp } from "@/games/shogi/components/pop-up";
import type { JSXElement } from "solid-js";
import { For, Show, createSignal } from "solid-js";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";

const historyFillArray = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

const position = (index: number): string => {
  return `${"ABC"[index % 3] ?? ""}-${Math.floor(index / 3) + 1}`;
};

type HistoryProperties = {
  readonly history: readonly number[];
};
export const History = (properties: HistoryProperties): JSXElement => {
  const [open, setOpen] = createSignal(false);
  const paddedHistory = (): number[] => [...properties.history, ...historyFillArray].slice(0, 9);

  return (
    <button
      type="button"
      onClick={() => {
        setOpen(true);
      }}
    >
      <HeaderButton icon="history">History</HeaderButton>

      <PopUp
        open={open()}
        outerClick={() => {
          setOpen(false);
        }}
      >
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
      </PopUp>
    </button>
  );
};
