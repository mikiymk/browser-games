import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import { DefineCards } from "../../../common/components/image-card/define.tsx";
import { CARD_RANKS, CARD_SUITS } from "../../../common/components/image-card/id.ts";
import { UseCard, UseSuit } from "../../../common/components/image-card/use.tsx";
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
              <UseSuit suit={suit} />
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
                  <UseCard card={`card-${suit}-${rank}`} />
                </svg>
              )}
            </For>
          </div>
        )}
      </For>
      <div>
        <svg class={image} viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
          <title>View</title>
          <UseCard card="card-back" />
        </svg>
      </div>
    </div>
  );
};
