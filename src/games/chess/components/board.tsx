import { For } from "solid-js";

import { BoardSquare } from "./board-square";

import type { BoardCell } from "../board";

import { MoveTarget } from "../constants";
import { boardStyle, movableSquareStyle, squareStyle } from "@/styles/chess.css";
import board from "@/images/chess/board.svg";
import piece from "@/images/chess/piece.svg";

type BoardProperties = {
  board: BoardCell[];
  handleClick: (square: BoardCell, index: number) => void;
};

export const Board = (properties: BoardProperties) => {
  return (
    <>
      <div
        class={boardStyle}
        style={{
          "background-image": `url(${board.src})`,
        }}
      >
        <For each={properties.board}>
          {(cell, index) => (
            <button
              type="button"
              class={cell.mark === MoveTarget ? movableSquareStyle : squareStyle}
              onClick={() => {
                properties.handleClick(cell, index());
              }}
            >
              <BoardSquare piece={cell.piece} mark={cell.mark} />
            </button>
          )}
        </For>
      </div>
      <svg
        viewBox="0 0 30 20"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          fill: "#ddd",
          stroke: "black",
        }}
      >
        <title>chess pieces</title>
        <use href={`${piece.src}#pawn`} x={0} y={0} height={10} width={10} />
        <use href={`${piece.src}#knight`} x={10} y={0} height={10} width={10} />
        <use href={`${piece.src}#bishop`} x={20} y={0} height={10} width={10} />
        <use href={`${piece.src}#rook`} x={0} y={10} height={10} width={10} />
        <use href={`${piece.src}#queen`} x={10} y={10} height={10} width={10} />
        <use href={`${piece.src}#king`} x={20} y={10} height={10} width={10} />
      </svg>
    </>
  );
};
