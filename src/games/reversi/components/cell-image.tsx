import { classes } from "@/scripts/classes";
import { Match, Switch } from "solid-js";
import type { JSXElement } from "solid-js";
import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellWhite } from "../const.ts";
import Styles from "./style.module.css";

type CellImageProperties = {
  readonly square: number;
  readonly x: number;
  readonly y: number;
};
export const CellImage = (properties: CellImageProperties): JSXElement => {
  return (
    <Switch>
      <Match when={properties.square === CellBlack}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={4} class={classes(Styles.stone, Styles.black)} />
      </Match>
      <Match when={properties.square === CellWhite}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={4} class={classes(Styles.stone, Styles.white)} />
      </Match>
      <Match when={properties.square === CellCanMoveBlack}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={2} class={Styles.black} />
      </Match>
      <Match when={properties.square === CellCanMoveWhite}>
        <circle cx={properties.x + 5} cy={properties.y + 5} r={2} class={Styles.white} />
      </Match>
    </Switch>
  );
};
