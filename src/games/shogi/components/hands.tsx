import type { JSXElement } from "solid-js";

import { For, Show } from "solid-js";

import type { Hand } from "../constants.ts";

import { WHITE } from "../constants.ts";
import { Button } from "./button.tsx";
import { hand } from "./style.css.ts";

type HandsProperties = {
  readonly color: number;
  readonly hands: Hand;
  readonly onClick: (index: number) => void;
};
export const Hands = (properties: HandsProperties): JSXElement => {
  return (
    <tr>
      <th class={hand}>
        <Show fallback="☖" when={properties.color === WHITE}>
          ☗
        </Show>
      </th>
      <For each={properties.hands}>
        {(piece, index) => (
          <td class={hand}>
            <Button
              onClick={() => {
                properties.onClick(index() + 100);
              }}
            >
              {piece}
            </Button>
          </td>
        )}
      </For>
    </tr>
  );
};
