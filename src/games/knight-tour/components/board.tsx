import { Board } from "../../../common/components/game-board/board.tsx";
import { chessBoard } from "../../../images/image-sources.ts";
import { Square } from "./square.tsx";

import type { JSXElement } from "solid-js";

type BoardProperties = {
  readonly board: readonly number[];
  readonly handleClick: (index: number) => void;
  readonly hintMode: boolean;
};

export const KnightBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board
      background={chessBoard}
      data={properties.board}
      height={8}
      onClick={(_, index) => {
        properties.handleClick(index);
      }}
      width={8}
    >
      {(cell, index, x, y) => (
        <Square board={properties.board} cell={cell} hintMode={properties.hintMode} index={index} x={x} y={y} />
      )}
    </Board>
  );
};
