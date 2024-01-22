import { boardStyle } from "@/games/knight-tour/style.css";
import board from "@/images/chess/board.svg";
import type { JSXElement } from "solid-js";
import { For } from "solid-js";
import { Square } from "./square";

type BoardProperties = {
  readonly board: readonly number[];
  readonly hintMode: boolean;
  readonly handleClick: (index: number) => void;
};

export const Board = (properties: BoardProperties): JSXElement => {
  return (
    <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" class={boardStyle}>
      <title>chess board</title>

      <use href={`${board.src}#root`} />

      <For each={properties.board}>
        {(cell, index) => (
          <Square
            board={properties.board}
            cell={cell}
            index={index()}
            hintMode={properties.hintMode}
            click={() => {
              properties.handleClick(index());
            }}
          />
        )}
      </For>
    </svg>
  );
};
