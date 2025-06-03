import type { JSXElement } from "solid-js";

import type { BoardCell } from "../board.ts";

import { Board } from "../../../common/components/game-board/board.tsx";
import { chessBoard } from "../../../images/image-sources.ts";
import { BoardSquare } from "./board-square.tsx";

type BoardProperties = {
  readonly board: readonly BoardCell[];
  readonly handleClick: (square: BoardCell, index: number) => void;
};

export const ChessBoard = (properties: BoardProperties): JSXElement => {
  return (
    <Board background={chessBoard} click={properties.handleClick} data={properties.board} height={8} width={8}>
      {(cell, _, x, y) => {
        return <BoardSquare mark={cell.mark} piece={cell.piece} x={x} y={y} />;
      }}
    </Board>
  );
};
