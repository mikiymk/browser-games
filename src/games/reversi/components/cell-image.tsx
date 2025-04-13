import type { JSXElement } from "solid-js";

import { Match, Switch } from "solid-js";

import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellWhite } from "../const.ts";
import { black, stoneBlack, stoneWhite, white } from "./style.css.ts";

type CellImageProperties = {
  readonly square: number;
  readonly x: number;
  readonly y: number;
};
export const CellImage = (properties: CellImageProperties): JSXElement => {
  return (
    <Switch>
      <Match when={properties.square === CellBlack}>
        <circle class={stoneBlack} cx={properties.x + 5} cy={properties.y + 5} r={4} />
      </Match>
      <Match when={properties.square === CellWhite}>
        <circle class={stoneWhite} cx={properties.x + 5} cy={properties.y + 5} r={4} />
      </Match>
      <Match when={properties.square === CellCanMoveBlack}>
        <circle class={black} cx={properties.x + 5} cy={properties.y + 5} r={2} />
      </Match>
      <Match when={properties.square === CellCanMoveWhite}>
        <circle class={white} cx={properties.x + 5} cy={properties.y + 5} r={2} />
      </Match>
    </Switch>
  );
};
