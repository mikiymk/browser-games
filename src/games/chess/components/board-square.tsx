import type { JSXElement } from "solid-js";

import { MoveFrom, MoveTarget } from "../constants.ts";
import { UsePiece } from "./define.tsx";
import { square } from "./style.css.ts";

type BoardSquareProperties = {
  readonly mark: number;
  readonly piece: number;
  readonly x: number;
  readonly y: number;
};

export const BoardSquare = (properties: BoardSquareProperties): JSXElement => {
  const markStyle = (): string => {
    return square[
      (
        {
          [MoveFrom]: "from",
          [MoveTarget]: "target",
        } as const
      )[properties.mark] ?? "normal"
    ];
  };

  return (
    <>
      <rect class={markStyle()} height={8} width={8} x={properties.x + 1} y={properties.y + 1} />
      <UsePiece piece={properties.piece} x={properties.x} y={properties.y} />
    </>
  );
};
