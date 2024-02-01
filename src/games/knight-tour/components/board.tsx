import { boardStyle } from "@/games/knight-tour/style.css";
import board from "@/images/chess/board.svg";
import type { JSXElement } from "solid-js";
import { Square } from "./square";
import { Board } from "@/components/board/board";

type BoardProperties = {
  readonly board: readonly number[];
  readonly hintMode: boolean;
  readonly handleClick: (index: number) => void;
};

export const KnightBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board
      height={8}
      width={8}
      data={properties.board}
      background={board.src}
      class={boardStyle}
      click={(_, index) => {
        properties.handleClick(index);
      }}
    >
      {(cell, index, x, y) => (
        <Square board={properties.board} cell={cell} index={index()} x={x()} y={y()} hintMode={properties.hintMode} />
      )}
    </Board>
  );
};
