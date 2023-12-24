import { For } from "solid-js";

import { BoardSquare } from "./board-square";

import type { BoardCell } from "../board";

import { MoveTarget } from "../constants";

type BoardProperties = {
  board: BoardCell[];
  handleClick: (square: BoardCell, index: number) => void;
};

export const Board = (properties: BoardProperties) => {
  return (
    <div class="board">
      <For each={properties.board}>
        {(cell, index) => (
          <button
            type="button"
            onClick={() => {
              properties.handleClick(cell, index());
            }}
            classList={{
              square: true,
              movable: cell.mark === MoveTarget,
            }}
            style={{
              background: cell.mark === MoveTarget ? "red" : "white",
            }}
          >
            <BoardSquare piece={cell.piece} mark={cell.mark} />
          </button>
        )}
      </For>
    </div>
  );
};
