import type { JSXElement } from "solid-js";

import { createMemo } from "solid-js";

import { CellKnight, CellMovable, CellVisited } from "../constants.ts";
import { getLegalMove } from "../knight-move.ts";
import { UsePiece } from "./define.tsx";

type SquareProperties = {
  readonly board: readonly number[];
  readonly cell: number;
  readonly hintMode: boolean;
  readonly index: number;
  readonly x: number;

  readonly y: number;
};
export const Square = (properties: SquareProperties): JSXElement => {
  const getMovableCount = createMemo(
    () =>
      getLegalMove(properties.index).filter(
        (index) => properties.board[index] !== CellVisited && properties.board[index] !== CellKnight,
      ).length,
  );

  const id = (): "cross" | "knight" | "nought" | number | undefined => {
    switch (properties.cell) {
      case CellKnight:
        return "knight";
      case CellMovable: {
        if (properties.hintMode) {
          return getMovableCount();
        }

        return "nought";
      }

      case CellVisited:
        return "cross";

      default:
        return;
    }
  };

  return <UsePiece id={id()} x={properties.x} y={properties.y} />;
};
