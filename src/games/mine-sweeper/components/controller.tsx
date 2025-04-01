import { Match, Show, Switch } from "solid-js";
import type { JSXElement } from "solid-js";
import { Bombed, Clear, EmojiBombed, EmojiClear, EmojiSmile, FieldFlag } from "../consts.ts";
import { fontEmoji } from "./style.css.ts";

type ControllerProperties = {
  readonly state: number;
  readonly fields: readonly number[];
  readonly mines: number;
};

export const Status = (properties: ControllerProperties): JSXElement => {
  return (
    <output>
      <Show when={properties.state !== Bombed && properties.state !== Clear}>
        {properties.fields.filter((field) => field === FieldFlag).length} / {properties.mines}
      </Show>
      <span class={fontEmoji}>
        <Switch fallback={EmojiSmile}>
          <Match when={properties.state === Bombed}>{EmojiBombed}</Match>
          <Match when={properties.state === Clear}>{EmojiClear}</Match>
        </Switch>
      </span>
    </output>
  );
};
