import piece from "@/images/chess/piece.svg";
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

  const pieceHref = (): string => {
    switch (properties.piece) {
      case CellBlackPawn:
      case CellWhitePawn:
        return `${piece.src}#pawn`;

      case CellBlackKnight:
      case CellWhiteKnight:
        return `${piece.src}#knight`;

      case CellBlackBishop:
      case CellWhiteBishop:
        return `${piece.src}#bishop`;

      case CellBlackRook:
      case CellWhiteRook:
        return `${piece.src}#rook`;

      case CellBlackQueen:
      case CellWhiteQueen:
        return `${piece.src}#queen`;

      case CellBlackKing:
      case CellWhiteKing:
        return `${piece.src}#king`;

      default:
        return "";
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
