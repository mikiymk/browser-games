import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import { DefineChessPieces } from "../../../common/components/image-chess/define.tsx";
import { PIECES } from "../../../common/components/image-chess/id.ts";
import { UseChessPiece } from "../../../common/components/image-chess/piece.tsx";
import { image } from "./style.css.ts";

export const ChessImage = (): JSXElement => {
  return (
    <div>
      <DefineChessPieces />

      <div>
        <For each={PIECES}>
          {(piece) => (
            <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <title>View</title>
              <UseChessPiece color="white" piece={piece} />
            </svg>
          )}
        </For>
      </div>
      <div>
        <For each={PIECES}>
          {(piece) => (
            <svg class={image} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <title>View</title>
              <UseChessPiece color="black" piece={piece} />
            </svg>
          )}
        </For>
      </div>
    </div>
  );
};
