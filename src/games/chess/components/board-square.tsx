import { Show } from "solid-js";

import { UseImage } from "../../../common/components/use-image/use.tsx";
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
} from "../constants.ts";
import { squareFrom, squareTarget } from "./style.css.ts";

import type { JSXElement } from "solid-js";

const idMap: Record<number, string> = {
  [CellBlackBishop]: "bishop-black",
  [CellBlackKing]: "king-black",
  [CellBlackKnight]: "knight-black",
  [CellBlackPawn]: "pawn-black",
  [CellBlackQueen]: "queen-black",
  [CellBlackRook]: "rook-black",
  [CellWhiteBishop]: "bishop-white",
  [CellWhiteKing]: "king-white",
  [CellWhiteKnight]: "knight-white",
  [CellWhitePawn]: "pawn-white",
  [CellWhiteQueen]: "queen-white",
  [CellWhiteRook]: "rook-white",
};

type BoardSquareProperties = {
  readonly mark: number;
  readonly piece: number;
  readonly x: number;
  readonly y: number;
};

export const BoardSquare = (properties: BoardSquareProperties): JSXElement => {
  const markStyle = (): string | undefined => {
    return {
      [MoveFrom]: squareFrom,
      [MoveTarget]: squareTarget,
    }[properties.mark];
  };

  return (
    <>
      <Show when={markStyle()}>
        {(style) => <rect class={style()} height={8} width={8} x={properties.x + 1} y={properties.y + 1} />}
      </Show>
      <UseImage height={10} id={idMap[properties.piece]} width={10} x={properties.x} y={properties.y} />
    </>
  );
};
