import { Match, Show, Switch } from "solid-js";

import { notoEmoji } from "../../../styles/fonts.css.ts";
import { Bombed, Clear, EmojiBombed, EmojiClear, EmojiSmile, FieldFlag } from "../constants.ts";

import type { JSXElement } from "solid-js";

type ControllerProperties = {
  readonly fields: readonly number[];
  readonly mines: number;
  readonly state: number;
};

export const Status = (properties: ControllerProperties): JSXElement => {
  return (
    <output>
      <Show when={properties.state !== Bombed && properties.state !== Clear}>
        {properties.fields.filter((field) => field === FieldFlag).length} / {properties.mines}
      </Show>
      <span class={notoEmoji}>
        <Switch fallback={EmojiSmile}>
          <Match when={properties.state === Bombed}>{EmojiBombed}</Match>
          <Match when={properties.state === Clear}>{EmojiClear}</Match>
        </Switch>
      </span>
    </output>
  );
};
