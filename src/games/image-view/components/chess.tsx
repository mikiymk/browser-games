import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import { DefineChessPieces } from "../../../common/components/image/define.tsx";
import { CHESS_COLORS, CHESS_PIECES } from "../../../common/components/image/id.ts";
import { UseImage } from "../../../common/components/use-image/use.tsx";
import { image } from "./style.css.ts";

export const ChessImage = (): JSXElement => {
  return (
    <div>
      <DefineChessPieces />

      <For each={CHESS_COLORS}>
        {(color) => (
          <div>
            <For each={CHESS_PIECES}>
              {(piece) => (
                <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <title>View</title>
                  <UseImage id={`${piece}-${color}`} />
                </svg>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};
