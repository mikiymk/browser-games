import type { JSXElement } from "solid-js";

import { Board } from "../../../components/board/board.tsx";
import { FieldBomb, FieldFlag, FieldNoOpen, FieldOpen } from "../consts.ts";
import { UseSymbol } from "./define.tsx";

type MineCellProperties = {
  readonly field: number;
  readonly x: number;
  readonly y: number;
};
const MineCell = (properties: MineCellProperties): JSXElement => {
  const id = (): "close" | "flag" | "mine" | "open" | number => {
    return (
      (
        {
          [FieldBomb]: "mine",
          [FieldFlag]: "flag",
          [FieldNoOpen]: "close",
          [FieldOpen]: "open",
        } as const
      )[properties.field] ?? properties.field
    );
  };

  return <UseSymbol id={id()} x={properties.x} y={properties.y} />;
};

type MineFieldsProperties = {
  readonly fields: readonly number[];
  readonly flag: (index: number) => boolean;
  readonly height: number;

  readonly open: (index: number) => void;
  readonly width: number;
};
export const MineFields = (properties: MineFieldsProperties): JSXElement => {
  return (
    <Board
      click={(_, index) => {
        properties.open(index);
      }}
      contextmenu={(_, index, event) => {
        if (properties.flag(index)) {
          event.preventDefault();
        }
      }}
      data={properties.fields}
      height={properties.height}
      width={properties.width}
    >
      {(field, _, x, y) => <MineCell field={field} x={x} y={y} />}
    </Board>
  );
};
