import { Board } from "@/components/board/board";
import type { BoardCell } from "@/games/chess/board";
import board from "@/images/chess/board.svg";
import type { JSXElement } from "solid-js";
import { BoardSquare } from "./board-square";

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
