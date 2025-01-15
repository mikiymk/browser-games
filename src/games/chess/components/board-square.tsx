import { MoveFrom, MoveTarget } from "@/games/chess/constants";
import type { JSXElement } from "solid-js";
import { UsePiece } from "./define";

type BoardSquareProperties = {
  readonly piece: number;
  readonly mark: number;
  readonly x: number;
  readonly y: number;
};

export const BoardSquare = (properties: BoardSquareProperties): JSXElement => {
  const markStyle = (): string | undefined =>
    properties.mark === MoveTarget
      ? "cursor-pointer fill-orange-500"
      : properties.mark === MoveFrom
        ? "cursor-pointer fill-slate-900"
        : "fill-none";

  return (
    <>
      <rect x={properties.x + 1} y={properties.y + 1} height={8} width={8} class={markStyle()} />
      <UsePiece piece={properties.piece} x={properties.x} y={properties.y} />
    </>
  );
};
