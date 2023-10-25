import { For } from "solid-js";

import { cellStyle } from "@/styles/knight-tour.css";
import { boardStyle } from "@/styles/reversi.css";

import { CellImage } from "./cell-image";

type BoardProperties = {
  board: number[];
  click: (square: number, index: number) => void;
};

export const Board = (properties: BoardProperties) => {
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
