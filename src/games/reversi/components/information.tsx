import type { JSXElement } from "solid-js";

import { Show } from "solid-js";

import { CellBlack } from "../constants.ts";
import { iconOuter, next, stoneBlack, stoneWhite } from "./style.css.ts";

// ゲーム終了時に結果を表示する

type StoneProperties = {
  readonly color: number;
  readonly count: number;

  readonly isNext: boolean;
};
export const StoneCount = (properties: StoneProperties): JSXElement => {
  return (
    <div class={properties.isNext ? next : ""}>
      <Show
        fallback={
          <svg class={iconOuter} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <title>white</title>
            <circle class={stoneWhite} cx={30} cy={30} r={25} />
          </svg>
        }
        when={properties.color === CellBlack}
      >
        <svg class={iconOuter} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <title>black</title>
          <circle class={stoneBlack} cx={30} cy={30} r={25} />
        </svg>
      </Show>

      {properties.count}
    </div>
  );
};
