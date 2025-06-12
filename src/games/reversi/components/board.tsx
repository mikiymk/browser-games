import type { JSXElement } from "solid-js";

import { Board } from "../../../common/components/game-board/board.tsx";
import { reversiBoard } from "../../../images/image-sources.ts";
import { CellImage } from "./cell-image.tsx";

type BoardProperties = {
  readonly board: readonly number[];
  readonly handleClick: (square: number, index: number) => void;
};

export const ReversiBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board background={reversiBoard} data={properties.board} height={8} onClick={properties.handleClick} width={8}>
      {(square, _, x, y) => {
        return <CellImage square={square} x={x} y={y} />;
      }}
    </Board>
  );
};
