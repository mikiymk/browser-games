import { Match, Switch } from "solid-js";

import { Bomb, Flag, Number1, Number2, Number3, Number4, Number5, Number6, Number7, Number8 } from "./graphic";

type MineField = {
  field: number;
};
export const MineField = (properties: MineField) => {
  return (
    <Switch>
      <Match when={properties.field == -3}>
        <div class="field">
          <div class="field-close">
            <Bomb />
          </div>
        </div>
      </Match>
      <Match when={properties.field == -2}>
        <div class="field">
          <div class="field-close">
            <Flag />
          </div>
        </div>
      </Match>
      <Match when={properties.field == -1}>
        <div class="field">
          <div class="field-close" />
        </div>
      </Match>
      <Match when={properties.field == 0}>
        <div class="field">
          <div class="field-open" />
        </div>
      </Match>
      <Match when={properties.field == 1}>
        <div class="field">
          <div class="field-open">
            <Number1 />
          </div>
        </div>
      </Match>
      <Match when={properties.field == 2}>
        <div class="field">
          <div class="field-open">
            <Number2 />
          </div>
        </div>
      </Match>
      <Match when={properties.field == 3}>
        <div class="field">
          <div class="field-open">
            <Number3 />
          </div>
        </div>
      </Match>
      <Match when={properties.field == 4}>
        <div class="field">
          <div class="field-open">
            <Number4 />
          </div>
        </div>
      </Match>
      <Match when={properties.field == 5}>
        <div class="field">
          <div class="field-open">
            <Number5 />
          </div>
        </div>
      </Match>
      <Match when={properties.field == 6}>
        <div class="field">
          <div class="field-open">
            <Number6 />
          </div>
        </div>
      </Match>
      <Match when={properties.field == 7}>
        <div class="field">
          <div class="field-open">
            <Number7 />
          </div>
        </div>
      </Match>
      <Match when={properties.field == 8}>
        <div class="field">
          <div class="field-open">
            <Number8 />
          </div>
        </div>
      </Match>
    </Switch>
  );
};
