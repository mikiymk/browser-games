import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import { DefineCards } from "../../../common/components/image/define.tsx";
import { CARD_RANKS, CARD_SUITS } from "../../../common/components/image/id.ts";
import { UseImage } from "../../../common/components/use-image/use.tsx";
import { image } from "./style.css.ts";

export const CardImage = (): JSXElement => {
  return (
    <div>
      <DefineCards />

      <div>
        <For each={CARD_SUITS}>
          {(suit) => (
            <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <title>View</title>
              <UseImage id={suit} />
            </svg>
          )}
        </For>
      </div>

      <For each={CARD_SUITS}>
        {(suit) => (
          <div>
            <For each={CARD_RANKS}>
              {(rank) => (
                <svg class={image} viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
                  <title>View</title>
                  <UseImage id={`card-${suit}-${rank}`} />
                </svg>
              )}
            </For>
          </div>
        )}
      </For>
      <div>
        <svg class={image} viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseImage id="card-back" />
        </svg>
      </div>
    </div>
  );
};
