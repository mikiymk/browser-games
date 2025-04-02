import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { CellBlack } from "../const.ts";
import { iconBlack, iconOuter, iconWhite, next } from "./style.css.ts";

// ゲーム終了時に結果を表示する

type StoneProperties = {
  readonly count: number;
  readonly color: number;

  readonly isNext: boolean;
};
export const StoneCount = (properties: StoneProperties): JSXElement => {
  return (
    <div class={properties.isNext ? next : ""}>
      <Show
        when={properties.color === CellBlack}
        fallback={
          <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class={iconOuter}>
            <title>white</title>
            <circle cx={30} cy={30} r={25} class={iconWhite} />
          </svg>
        }
      >
        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class={iconOuter}>
          <title>black</title>
          <circle cx={30} cy={30} r={25} class={iconBlack} />
        </svg>
      </Show>

      {properties.count}
    </div>
  );
};
