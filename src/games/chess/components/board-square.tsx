import type { JSXElement } from "solid-js";
import { MoveFrom, MoveTarget } from "../constants.ts";
import { UsePiece } from "./define.tsx";
import Styles from "./style.module.css";

type BoardSquareProperties = {
  readonly piece: number;
  readonly mark: number;
  readonly x: number;
  readonly y: number;
};

export const BoardSquare = (properties: BoardSquareProperties): JSXElement => {
  const markStyle = (): string | undefined =>
    properties.mark === MoveTarget
      ? Styles["square-target"]
      : properties.mark === MoveFrom
        ? Styles["square-from"]
        : Styles.square;

  return (
    <>
      <rect x={properties.x + 1} y={properties.y + 1} height={8} width={8} class={markStyle()} />
      <UsePiece piece={properties.piece} x={properties.x} y={properties.y} />
    </>
  );
};
