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
        fallback={
          <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 inline aspect-square">
            <title>white</title>
            <circle cx={30} cy={30} r={25} class="fill-stone-200 stroke-slate-900" />
          </svg>
        }
      >
        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 inline aspect-square">
          <title>white</title>
          <circle cx={30} cy={30} r={25} class="fill-stone-500 stroke-slate-900" />
        </svg>
      </Show>

      {properties.count}
    </div>
  );
};
