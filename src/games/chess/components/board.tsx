import type { BoardCell } from "@/games/chess/board";
import { boardStyle } from "@/games/chess/style.css";
import board from "@/images/chess/board.svg";
import type { JSXElement } from "solid-js";
import { For } from "solid-js";
import { BoardSquare } from "./board-square";

type BoardProperties = {
  readonly board: readonly BoardCell[];
  readonly handleClick: (square: BoardCell, index: number) => void;
};

export const Board = (properties: BoardProperties): JSXElement => {
  return (
    <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" class={boardStyle}>
      <title>chess board</title>

      <use href={`${board.src}#root`} />

      <For each={properties.board}>
        {(cell, index) => {
          return (
            <BoardSquare
              piece={cell.piece}
              mark={cell.mark}
              x={index() % 8}
              y={Math.floor(index() / 8)}
              click={() => {
                properties.handleClick(cell, index());
              }}
            />
          );
        }}
      </For>
    </svg>
  );
};
