import type { JSXElement } from "solid-js";
import { Board } from "../../../components/board/board.ts";
import board from "../../../images/reversi/board.svg";
import { CellImage } from "./cell-image.tsx";

type BoardProperties = {
  readonly board: readonly number[];
  readonly click: (square: number, index: number) => void;
};

export const ReversiBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board height={8} width={8} data={properties.board} background={board.src} click={properties.click}>
      {(square, _, x, y) => {
        return <CellImage square={square} x={x} y={y} />;
      }}
    </Board>
  );
};
