import type { JSXElement } from "solid-js";
import { Board } from "../../../components/board/board.ts";
import { FieldBomb, FieldFlag, FieldNoOpen, FieldOpen } from "../consts.ts";
import { UseSymbol } from "./define.tsx";

type MineCellProperties = {
  readonly field: number;
  readonly x: number;
  readonly y: number;
};
const MineCell = (properties: MineCellProperties): JSXElement => {
  const id = (): number | "close" | "flag" | "mine" | "open" => {
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
  readonly height: number;
  readonly width: number;
  readonly fields: readonly number[];

  readonly open: (index: number) => void;
  readonly flag: (index: number) => boolean;
};
export const MineFields = (properties: MineFieldsProperties): JSXElement => {
  return (
    <Board
      height={properties.height}
      width={properties.width}
      data={properties.fields}
      click={(_, index) => {
        properties.open(index);
      }}
      contextmenu={(_, index, event) => {
        if (properties.flag(index)) {
          event.preventDefault();
        }
      }}
    >
      {(field, _, x, y) => <MineCell field={field} x={x} y={y} />}
    </Board>
  );
};
