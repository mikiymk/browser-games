import { Match, Switch } from "solid-js";
import type { JSXElement } from "solid-js";
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
        <circle cx={properties.x + 5} cy={properties.y + 5} r={4} class={stoneBlack} />
      </Match>
      <Match when={properties.square === CellWhite}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={4} class={stoneWhite} />
      </Match>
      <Match when={properties.square === CellCanMoveBlack}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={2} class={black} />
      </Match>
      <Match when={properties.square === CellCanMoveWhite}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={2} class={white} />
      </Match>
    </Switch>
  );
};
