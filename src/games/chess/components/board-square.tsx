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
} from "@/games/chess/constants";
import { movableSquareStyle, pieceBlackStyle, pieceWhiteStyle, selectedStyle } from "@/games/chess/style.css";
import bishop from "@/images/chess/bishop.svg";
import king from "@/images/chess/king.svg";
import knight from "@/images/chess/knight.svg";
import pawn from "@/images/chess/pawn.svg";
import queen from "@/images/chess/queen.svg";
import rook from "@/images/chess/rook.svg";
import frame from "@/images/icon/frame.svg";
import type { JSXElement } from "solid-js";
import { Show } from "solid-js";

type BoardSquareProperties = {
  readonly piece: number;
  readonly mark: number;
  readonly x: number;
  readonly y: number;
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

  const markStyle = (): string | undefined =>
    properties.mark === MoveTarget ? movableSquareStyle : properties.mark === MoveFrom ? selectedStyle : undefined;

  return (
    <>
      <Show when={pieceHref()}>
        {(href) => <use href={href()} x={properties.x} y={properties.y} height={10} width={10} class={pieceStyle()} />}
      </Show>
      <Show when={markStyle()}>
        {(style) => (
          <use href={`${frame.src}#root`} x={properties.x} y={properties.y} height={10} width={10} class={style()} />
        )}
      </Show>
    </>
  );
};
