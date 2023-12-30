import { For } from "solid-js";

import board from "@/images/chess/board.svg";
import { boardStyle, movableSquareStyle, selectedStyle, squareStyle } from "@/styles/chess.css";

import { BoardSquare } from "./board-square";

import type { BoardCell } from "../board";

import { MoveFrom, MoveTarget } from "../constants";

type BoardProperties = {
  board: BoardCell[];
  handleClick: (square: BoardCell, index: number) => void;
};

export const Board = (properties: BoardProperties) => {
  return (
    <div
      class={boardStyle}
      style={{
        "background-image": `url(${board.src})`,
      }}
    >
      <For each={properties.board}>
        {(cell, index) => (
          <button
            type="button"
            class={cell.mark === MoveTarget ? movableSquareStyle : cell.mark === MoveFrom ? selectedStyle : squareStyle}
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
