import { cellStyle } from "@/styles/knight-tour.css";
import { boardStyle } from "@/styles/reversi.css";
import type { JSXElement } from "solid-js";
import { For } from "solid-js";
import { CellImage } from "./cell-image";

type BoardProperties = {
  readonly board: readonly number[];
  readonly click: (square: number, index: number) => void;
};

export const Board = (properties: BoardProperties): JSXElement => {
  return (
    <div class={boardStyle}>
      <For each={properties.board}>
        {(square, index) => {
          return (
            <button
              type="button"
              onClick={() => {
                properties.click(square, index());
              }}
              class={cellStyle}
            >
              <CellImage square={square} />
            </button>
          );
        }}
      </For>
    </div>
  );
};
