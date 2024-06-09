import { StyledSvg } from "@/components/styled-svg";
import stone from "@/images/reversi/stone.svg";
import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { CellBlack } from "../const";

// ゲーム終了時に結果を表示する

type StoneProperties = {
  readonly count: number;
  readonly color: number;

  readonly isNext: boolean;
};
export const StoneCount = (properties: StoneProperties): JSXElement => {
  return (
    <div class={properties.isNext ? "border-slate-800 border-2 rounded" : ""}>
      <Show
        when={properties.color === CellBlack}
        fallback={<StyledSvg src={stone.src} alt="white" class="fill-stone-200 stroke-slate-900" />}
      >
        <StyledSvg src={stone.src} alt="black" class="fill-stone-500 stroke-slate-900" />
      </Show>

      {properties.count}
    </div>
  );
};
