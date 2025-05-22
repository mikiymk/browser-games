import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import { DefineShogiPieces } from "../../../common/components/image-shogi/define.tsx";
import { DIRECTIONS, PIECES } from "../../../common/components/image-shogi/id.ts";
import { UseShogiPiece } from "../../../common/components/image-shogi/use.tsx";
import { image } from "./style.css.ts";

export const ShogiImages = (): JSXElement => {
  return (
    <div>
      <DefineShogiPieces />

      <div>
        <For each={["shogi-piece-shape-up", "shogi-piece-shape-down"]}>
          {(piece) => (
            <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <title>View</title>
              <use href={`#${piece}`} />
            </svg>
          )}
        </For>
      </div>

      <For each={DIRECTIONS}>
        {(direction) => (
          <div>
            <For each={PIECES}>
              {(piece) => (
                <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <title>View</title>
                  <UseShogiPiece direction={direction} piece={piece} />
                </svg>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};
