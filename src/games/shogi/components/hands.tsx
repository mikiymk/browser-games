import { For, Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { Button } from "../../../components/elements/button.tsx";
import { WHITE } from "../constants.ts";
import type { Hand } from "../constants.ts";
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
        <Show when={properties.color === WHITE} fallback="☖">
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
