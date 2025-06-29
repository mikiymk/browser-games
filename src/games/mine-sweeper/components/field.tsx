import { Show } from "solid-js";

import { Board } from "../../../common/components/game-board/board.tsx";
import { FLAG, MINE } from "../../../common/components/image/id.ts";
import { UseImage } from "../../../common/components/use-image/use.tsx";
import { FieldBomb, FieldFlag, FieldNoOpen } from "../constants.ts";
import { SquareSeparation } from "../../../common/components/game-board/square-separation.tsx";
import { closed } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type MineCellProperties = {
  readonly field: number;
  readonly x: number;
  readonly y: number;
};
const MineCell = (properties: MineCellProperties): JSXElement => {
  const id = (): string | undefined => {
    if (properties.field > 0) {
      return String(properties.field);
    }

    return {
      [FieldBomb]: MINE,
      [FieldFlag]: FLAG,
    }[properties.field];
  };

  const isClosed = (): boolean => {
    return [FieldBomb, FieldFlag, FieldNoOpen].includes(properties.field);
  };

  return (
    <>
      <Show when={isClosed()}>
        <rect class={closed} height={10} width={10} x={properties.x} y={properties.y} />
      </Show>
      <UseImage height={10} id={id()} width={10} x={properties.x} y={properties.y} />
    </>
  );
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
      data={properties.fields}
      foreground={<SquareSeparation height={properties.height} width={properties.width} />}
      height={properties.height}
      onClick={(_, index) => {
        properties.open(index);
      }}
      onContextmenu={(_, index, event) => {
        if (properties.flag(index)) {
          event.preventDefault();
        }
      }}
      width={properties.width}
    >
      {(field, _, x, y) => <MineCell field={field} x={x} y={y} />}
    </Board>
  );
};
