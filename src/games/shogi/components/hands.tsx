import { Button } from "@/components/elements/button";
import { For, Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { WHITE } from "../constants";
import type { Hand } from "../constants";

type HandsProperties = {
  readonly color: number;
  readonly hands: Hand;
  readonly onClick: (index: number) => void;
};
export const Hands = (properties: HandsProperties): JSXElement => {
  return (
    <tr>
      <th class="px-1 text-center border border-slate-900 border-solid">
        <Show when={properties.color === WHITE} fallback="☖">
          ☗
        </Show>
      </th>
      <For each={properties.hands}>
        {(piece, index) => (
          <td class="px-1 text-center border border-slate-900 border-solid">
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
