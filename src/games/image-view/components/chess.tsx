import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import { DefineChessPieces } from "../../../common/components/image-chess/define.tsx";
import { CHESS_COLORS, CHESS_PIECES } from "../../../common/components/image-chess/id.ts";
import { UseChessPiece } from "../../../common/components/image-chess/use.tsx";
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
                  <UseChessPiece color={color} piece={piece} />
                </svg>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};
