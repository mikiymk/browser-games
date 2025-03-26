import type { JSXElement } from "solid-js";
import { Board } from "../../../components/board/board.ts";
import board from "../../../images/chess/board.svg";
import type { BoardCell } from "../board.ts";
import { BoardSquare } from "./board-square.tsx";

type BoardProperties = {
  readonly board: readonly BoardCell[];
  readonly handleClick: (square: BoardCell, index: number) => void;
};

export const ChessBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board height={8} width={8} data={properties.board} background={board.src} click={properties.handleClick}>
      {(cell, _, x, y) => {
        return <BoardSquare piece={cell.piece} mark={cell.mark} x={x} y={y} />;
      }}
    </Board>
  );
};
