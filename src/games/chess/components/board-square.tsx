import pawn from "@/images/chess-pieces/pawn.svg";
import knight from "@/images/chess-pieces/knight.svg";
import bishop from "@/images/chess-pieces/bishop.svg";
import rook from "@/images/chess-pieces/rook.svg";
import queen from "@/images/chess-pieces/queen.svg";
import king from "@/images/chess-pieces/king.svg";
import { movableSquareStyle, pieceBlackStyle, pieceWhiteStyle, selectedStyle, squareStyle } from "@/styles/chess.css";
import type { JSXElement } from "solid-js";
import { Show } from "solid-js";
import {
  CellBlackBishop,
  CellBlackKing,
  CellBlackKnight,
  CellBlackPawn,
  CellBlackQueen,
  CellBlackRook,
  CellWhiteBishop,
  CellWhiteKing,
  CellWhiteKnight,
  CellWhitePawn,
  CellWhiteQueen,
  CellWhiteRook,
  MoveFrom,
  MoveTarget,
} from "../constants";

type BoardSquareProperties = {
  readonly piece: number;
  readonly mark: number;
  readonly x: number;
  readonly y: number;

  readonly click: () => void;
};

export const BoardSquare = (properties: BoardSquareProperties): JSXElement => {
  const pieceStyle = (): string =>
    properties.piece === CellBlackPawn ||
    properties.piece === CellBlackKnight ||
    properties.piece === CellBlackBishop ||
    properties.piece === CellBlackRook ||
    properties.piece === CellBlackQueen ||
    properties.piece === CellBlackKing
      ? pieceBlackStyle
      : pieceWhiteStyle;

  const pieceHref = (): string | undefined => {
    switch (properties.piece) {
      case CellBlackPawn:
      case CellWhitePawn:
        return `${pawn.src}#root`;

      case CellBlackKnight:
      case CellWhiteKnight:
        return `${knight.src}#root`;

      case CellBlackBishop:
      case CellWhiteBishop:
        return `${bishop.src}#root`;

      case CellBlackRook:
      case CellWhiteRook:
        return `${rook.src}#root`;

      case CellBlackQueen:
      case CellWhiteQueen:
        return `${queen.src}#root`;

      case CellBlackKing:
      case CellWhiteKing:
        return `${king.src}#root`;

      default:
        return;
    }
  };

  const rectStyle = (): string =>
    properties.mark === MoveTarget ? movableSquareStyle : properties.mark === MoveFrom ? selectedStyle : squareStyle;

  return (
    <>
      <Show when={pieceHref()}>
        {(href) => <use href={href()} x={properties.x} y={properties.y} height={1} width={1} class={pieceStyle()} />}
      </Show>
      <rect
        x={properties.x}
        y={properties.y}
        height={1}
        width={1}
        class={rectStyle()}
        tabindex={0}
        onClick={() => {
          properties.click();
        }}
        onKeyPress={() => {
          properties.click();
        }}
      />
    </>
  );
};
