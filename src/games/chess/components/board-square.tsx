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
      ? "fill-stone-500 stroke-slate-900"
      : "fill-stone-200 stroke-slate-900";

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
    properties.mark === MoveTarget
      ? "stroke-[4] cursor-pointer stroke-orange-500"
      : properties.mark === MoveFrom
        ? "stroke-[4] cursor-pointer stroke-slate-900"
        : "stroke-[4] cursor-pointer stroke-none";

  return (
    <>
      <Show when={pieceHref()}>
        {(href) => <use href={href()} x={properties.x} y={properties.y} height={10} width={10} class={pieceStyle()} />}
      </Show>

      <use href={`${frame.src}#root`} x={properties.x} y={properties.y} height={10} width={10} class={markStyle()} />
    </>
  );
};
