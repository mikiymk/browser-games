import { boardStyle } from "@/styles/reversi.css";
import type { JSXElement } from "solid-js";
import { For } from "solid-js";
import { CellImage } from "./cell-image";
import board from "@/images/reversi/board.svg";

type BoardProperties = {
  readonly board: readonly number[];
  readonly click: (square: number, index: number) => void;
};

export const Board = (properties: BoardProperties): JSXElement => {
  return (
    <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" class={boardStyle}>
      <title>Reversi board</title>

      <use href={`${board.src}#root`} x={0} y={0} height={8} width={8} />

      <For each={properties.board}>
        {(square, index) => {
          return (
            <CellImage
              square={square}
              index={index()}
              click={() => {
                properties.click(square, index());
              }}
            />
          );
        }}
      </For>
    </svg>
  );
};
