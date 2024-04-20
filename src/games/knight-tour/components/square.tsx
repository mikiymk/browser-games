import { CellKnight, CellMovable, CellVisited } from "@/games/knight-tour/consts";
import { getLegalMove } from "@/games/knight-tour/knight-move";
import knight from "@/images/chess/knight.svg";
import cross from "@/images/icon/cross.svg";
import nought from "@/images/icon/nought.svg";
import number0 from "@/images/letter/0.svg";
import number1 from "@/images/letter/1.svg";
import number2 from "@/images/letter/2.svg";
import number3 from "@/images/letter/3.svg";
import number4 from "@/images/letter/4.svg";
import number5 from "@/images/letter/5.svg";
import number6 from "@/images/letter/6.svg";
import number7 from "@/images/letter/7.svg";
import number8 from "@/images/letter/8.svg";
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

  const imageSource = (): string | undefined => {
    switch (properties.cell) {
      case CellVisited:
        return cross.src;
      case CellMovable: {
        if (properties.hintMode) {
          switch (getMovableCount()) {
            case 0:
              return number0.src;
            case 1:
              return number1.src;
            case 2:
              return number2.src;
            case 3:
              return number3.src;
            case 4:
              return number4.src;
            case 5:
              return number5.src;
            case 6:
              return number6.src;
            case 7:
              return number7.src;
            default:
              return number8.src;
          }
        }

        return nought.src;
      }
      case CellKnight:
        return knight.src;
      default:
        return;
    }
  };

  const imageStyle = (): string => {
    switch (properties.cell) {
      case CellKnight:
        return "fill-stone-200 stroke-slate-900";
      default:
        return blackIndexes.has(properties.index) ? "fill-none stroke-slate-500" : "fill-none stroke-slate-300";
    }
  };

  return (
    <Show when={imageSource()}>
      {(source) => (
        <use href={`${source()}#root`} x={properties.x} y={properties.y} height={10} width={10} class={imageStyle()} />
      )}
    </Show>
  );
};
