import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import { UseCard } from "../../../common/components/image-card/card.tsx";
import { DefineCards } from "../../../common/components/image-card/define.tsx";
import { UseSuit } from "../../../common/components/image-card/suit.tsx";
import { Page } from "../../../components/page/page.tsx";
import { image } from "./style.css.ts";

export const App = (): JSXElement => {
  const suits = ["spade", "club", "diamond", "heart"] as const;
  const ranks = ["a", 2, 3, 4, 5, 6, 7, 8, 9, "t", "j", "q", "k"] as const;

  return (
    <Page>
      <DefineCards />

      <div>
        <For each={suits}>
          {(suit) => (
            <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <title>View</title>
              <UseSuit suit={suit} />
            </svg>
          )}
        </For>
      </div>

      <For each={suits}>
        {(suit) => (
          <div>
            <For each={ranks}>
              {(rank) => (
                <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <title>View</title>
                  <UseCard card={`card-${suit}-${rank}`} />
                </svg>
              )}
            </For>
          </div>
        )}
      </For>
    </Page>
  );
};
