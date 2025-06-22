import { For } from "solid-js";

import { DefineShogiPieces } from "../../../common/components/image/define.tsx";
import { SHOGI_DIRECTIONS, SHOGI_PIECES } from "../../../common/components/image/id.ts";
import { UseImage } from "../../../common/components/use-image/use.tsx";
import { image } from "./style.css.ts";

import type { JSXElement } from "solid-js";

export const ShogiImages = (): JSXElement => {
  return (
    <div>
      <DefineShogiPieces />

      <div>
        <For each={["shogi-piece-shape-up", "shogi-piece-shape-down"]}>
          {(piece) => (
            <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <title>View</title>
              <UseImage id={piece} />
            </svg>
          )}
        </For>
      </div>

      <For each={SHOGI_DIRECTIONS}>
        {(direction) => (
          <div>
            <For each={SHOGI_PIECES}>
              {(piece) => (
                <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <title>View</title>
                  <UseImage id={`${piece}-${direction}`} />
                </svg>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};
