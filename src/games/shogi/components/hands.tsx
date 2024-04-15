import { For, Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { WHITE } from "../constants";
import type { Hand } from "../constants";
import { handCellStyle } from "../style.css";
import { Button } from "./button";

type HandsProperties = {
  readonly color: number;
  readonly hands: Hand;
  readonly onClick: (index: number) => void;
};
export const Hands = (properties: HandsProperties): JSXElement => {
  return (
    <tr>
      <th class={handCellStyle}>
        <Show when={properties.color === WHITE} fallback="☖">
          ☗
        </Show>
      </th>
      <For each={properties.hands}>
        {(piece, index) => (
          <td class={handCellStyle}>
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
