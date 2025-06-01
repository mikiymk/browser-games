import type { JSXElement } from "solid-js";

import { Board } from "../../../common/components/game-board/board.tsx";
import board from "../../../images/chess/board.svg";
import { Square } from "./square.tsx";

type BoardProperties = {
  readonly board: readonly number[];
  readonly handleClick: (index: number) => void;
  readonly hintMode: boolean;
};

export const KnightBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board
      background={board.src}
      click={(_, index) => {
        properties.handleClick(index);
      }}
      data={properties.board}
      height={8}
      width={8}
    >
      {(cell, index, x, y) => (
        <Square board={properties.board} cell={cell} hintMode={properties.hintMode} index={index} x={x} y={y} />
      )}
    </Board>
  );
};
