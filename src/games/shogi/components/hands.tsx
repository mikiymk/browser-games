import { Button } from "@/components/elements/button";
import { For, Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { WHITE } from "../constants.ts";
import type { Hand } from "../constants.ts";
import Styles from "./style.module.css";

type HandsProperties = {
  readonly color: number;
  readonly hands: Hand;
  readonly onClick: (index: number) => void;
};
export const Hands = (properties: HandsProperties): JSXElement => {
  return (
    <tr>
      <th class={Styles.hand}>
        <Show when={properties.color === WHITE} fallback="☖">
          ☗
        </Show>
      </th>
      <For each={properties.hands}>
        {(piece, index) => (
          <td class={Styles.hand}>
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
