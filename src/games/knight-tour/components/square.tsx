import { Numbers } from "@/components/image/numbers";
import { Use } from "@/components/image/use";
import { CellKnight, CellMovable, CellVisited } from "@/games/knight-tour/consts";
import { getLegalMove } from "@/games/knight-tour/knight-move";
import knight from "@/images/chess/knight.svg";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import type { JSXElement } from "solid-js";
import { Show, createMemo } from "solid-js";

const blackIndexes = new Set([
  0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22, 25, 27, 29, 31, 32, 34, 36, 38, 41, 43, 45, 47, 48, 50, 52, 54, 57, 59, 61,
  63,
]);

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

  const imageStyle = (): string => {
    switch (properties.cell) {
      case CellKnight:
        return "fill-stone-200 stroke-slate-900";
      default:
        return blackIndexes.has(properties.index) ? "fill-none stroke-slate-500" : "fill-none stroke-slate-300";
    }
  };

  const imageSource = (): JSXElement | undefined => {
    switch (properties.cell) {
      case CellVisited:
        return <Use href={cross.src} x={properties.x} y={properties.y} class={imageStyle()} />;
      case CellMovable: {
        if (properties.hintMode) {
          return <Numbers number={getMovableCount()} x={properties.x} y={properties.y} class={imageStyle()} />;
        }

        return <Use href={nought.src} x={properties.x} y={properties.y} class={imageStyle()} />;
      }

      case CellKnight:
        return <Use href={knight.src} x={properties.x} y={properties.y} class={imageStyle()} />;

      default:
        return;
    }
  };

  return <Show when={imageSource()}>{(source) => source()}</Show>;
};
