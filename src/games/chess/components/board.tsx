import { For } from "solid-js";

import { BoardSquare } from "./board-square";

import type { BoardCell } from "../board";

type BoardProperties = {
  board: BoardCell[];
  handleClick: (square: BoardCell, index: number) => void;
};

export const Board = (properties: BoardProperties) => {
  return (
    <div>
      <For each={properties.board}>
        {(cell, index) => (
          <button
            type="button"
            onClick={() => {
              properties.handleClick(cell, index());
            }}
          >
            <BoardSquare piece={cell.piece} mark={cell.mark} />
          </button>
        )}
      </For>
    </div>
  );
};
