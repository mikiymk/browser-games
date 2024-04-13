import { Board } from "@/components/board/board";
import board from "@/images/shogi/board.svg";
import type { JSXElement } from "solid-js";
import { Square } from "./square";

type BoardProperties = {
  readonly board: readonly { readonly piece: number; readonly moveTarget: boolean }[];
  readonly onSquareClick: (index: number) => void;
};
export const ShogiBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board
      height={9}
      width={9}
      data={properties.board}
      background={board.src}
      click={(_square, index) => {
        properties.onSquareClick(index);
      }}
    >
      {(square, _index, x, y) => <Square x={x()} y={y()} square={square.piece} move={square.moveTarget} />}
    </Board>
  );
};
