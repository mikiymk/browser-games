import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { CellBlack } from "../const";
import Styles from "./style.module.css";
import { classes } from "@/scripts/classes";

// ゲーム終了時に結果を表示する

type StoneProperties = {
  readonly count: number;
  readonly color: number;

  readonly isNext: boolean;
};
export const StoneCount = (properties: StoneProperties): JSXElement => {
  return (
    <div class={properties.isNext ? Styles.next : ""}>
      <Show
        when={properties.color === CellBlack}
        fallback={
          <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class={Styles.icon}>
            <title>white</title>
            <circle cx={30} cy={30} r={25} class={classes(Styles.white, Styles["icon-stone"])} />
          </svg>
        }
      >
        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class={Styles.icon}>
          <title>white</title>
          <circle cx={30} cy={30} r={25} class={classes(Styles.black, Styles["icon-stone"])} />
        </svg>
      </Show>

      {properties.count}
    </div>
  );
};
