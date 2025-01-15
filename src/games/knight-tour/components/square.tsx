import { CellKnight, CellMovable, CellVisited } from "@/games/knight-tour/consts";
import { getLegalMove } from "@/games/knight-tour/knight-move";
import type { JSXElement } from "solid-js";
import { createMemo } from "solid-js";
import { UsePiece } from "./define";

type SquareProperties = {
  readonly board: readonly number[];
  readonly cell: number;
  readonly index: number;
  readonly x: number;
  readonly y: number;

  readonly hintMode: boolean;
};
export const Square = (properties: SquareProperties): JSXElement => {
  const getMovableCount = createMemo(
    () =>
      getLegalMove(properties.index).filter(
        (index) => properties.board[index] !== CellVisited && properties.board[index] !== CellKnight,
      ).length,
  );

  const id = (): number | "cross" | "knight" | "nought" | undefined => {
    switch (properties.cell) {
      case CellVisited:
        return "cross";
      case CellMovable: {
        if (properties.hintMode) {
          return getMovableCount();
        }

        return "nought";
      }

      case CellKnight:
        return "knight";

      default:
        return;
    }
  };

  return <UsePiece id={id()} x={properties.x} y={properties.y} />;
};
