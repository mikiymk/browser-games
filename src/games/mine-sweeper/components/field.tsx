import { Board } from "@/components/board/board";
import { FieldBomb, FieldFlag, FieldNoOpen, FieldOpen } from "@/games/mine-sweeper/consts";
import type { JSXElement } from "solid-js";
import { Show } from "solid-js";
import { MineCount, MineSymbol } from "./define";

type MineCellProperties = {
  readonly field: number;
  readonly x: number;
  readonly y: number;
};
const MineCell = (properties: MineCellProperties): JSXElement => {
  const id = (): "close" | "flag" | "mine" | "open" | undefined => {
    return (
      {
        [FieldBomb]: "mine",
        [FieldFlag]: "flag",
        [FieldNoOpen]: "close",
        [FieldOpen]: "open",
      } as const
    )[properties.field];
  };

  return (
    <>
      <Show when={id()} fallback={<MineCount count={properties.field} x={properties.x} y={properties.y} />}>
        {(id) => <MineSymbol symbol={id()} x={properties.x} y={properties.y} />}
      </Show>
    </>
  );
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
