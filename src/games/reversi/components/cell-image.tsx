import { Match, Switch } from "solid-js";
import type { JSXElement } from "solid-js";
import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellWhite } from "../const";

type CellImageProperties = {
  readonly square: number;
  readonly x: number;
  readonly y: number;
};
export const CellImage = (properties: CellImageProperties): JSXElement => {
  return (
    <Switch>
      <Match when={properties.square === CellBlack}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={4} class="fill-stone-800 stroke-slate-900 stroke-[0.5]" />
      </Match>
      <Match when={properties.square === CellWhite}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={4} class="fill-stone-200 stroke-slate-900 stroke-[0.5]" />
      </Match>
      <Match when={properties.square === CellCanMoveBlack}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={2} class="fill-stone-700" />
      </Match>
      <Match when={properties.square === CellCanMoveWhite}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={2} class="fill-stone-200" />
      </Match>
    </Switch>
  );
};
