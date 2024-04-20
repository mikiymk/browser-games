import { Board } from "@/components/board/board";
import {
  FieldBomb,
  FieldFlag,
  FieldNoOpen,
  FieldNumber1,
  FieldNumber2,
  FieldNumber3,
  FieldNumber4,
  FieldNumber5,
  FieldNumber6,
  FieldNumber7,
  FieldNumber8,
} from "@/games/mine-sweeper/consts";
import flag from "@/images/icon/flag.svg";
import mine from "@/images/icon/mine.svg";
import number1 from "@/images/letter/1.svg";
import number2 from "@/images/letter/2.svg";
import number3 from "@/images/letter/3.svg";
import number4 from "@/images/letter/4.svg";
import number5 from "@/images/letter/5.svg";
import number6 from "@/images/letter/6.svg";
import number7 from "@/images/letter/7.svg";
import number8 from "@/images/letter/8.svg";
import type { JSXElement } from "solid-js";
import { Show } from "solid-js";

type MineCellProperties = {
  readonly field: number;
  readonly x: number;
  readonly y: number;
  readonly onClick: () => void;
  readonly onContextMenu: () => boolean;
};
const MineCell = (properties: MineCellProperties): JSXElement => {
  const handleContextMenu = (event: MouseEvent): void => {
    if (properties.onContextMenu()) {
      event.preventDefault();
    }
  };

  const isClosed = (): boolean => {
    return properties.field === FieldBomb || properties.field === FieldFlag || properties.field === FieldNoOpen;
  };

  const imageSource = (): [source: string, style: string] | undefined => {
    switch (properties.field) {
      case FieldBomb:
        return [mine.src, "stroke-slate-900 stroke-2 fill-slate-900"];
      case FieldFlag:
        return [flag.src, "stroke-slate-900 stroke-2 fill-red-500"];

      case FieldNumber1:
        return [number1.src, "stroke-blue-500 stroke-2 fill-none"];
      case FieldNumber2:
        return [number2.src, "stroke-green-500 stroke-2 fill-none"];
      case FieldNumber3:
        return [number3.src, "stroke-red-500 stroke-2 fill-none"];
      case FieldNumber4:
        return [number4.src, "stroke-fuchsia-500 stroke-2 fill-none"];
      case FieldNumber5:
        return [number5.src, "stroke-red-800 stroke-2 fill-none"];
      case FieldNumber6:
        return [number6.src, "stroke-teal-400 stroke-2 fill-none"];
      case FieldNumber7:
        return [number7.src, "stroke-slate-900 stroke-2 fill-none"];
      case FieldNumber8:
        return [number8.src, "stroke-stone-500 stroke-2 fill-none"];
      default:
        return;
    }
  };

  return (
    <>
      <Show when={isClosed()}>
        <rect x={properties.x} y={properties.y} height={10} width={10} class="fill-slate-400" />
      </Show>

      <Show when={imageSource()}>
        {(source) => (
          <use
            href={`${source()[0]}#root`}
            x={properties.x}
            y={properties.y}
            height={10}
            width={10}
            class={source()[1]}
          />
        )}
      </Show>

      <rect
        x={properties.x}
        y={properties.y}
        height={10}
        width={10}
        tabindex={0}
        onClick={() => {
          properties.onClick();
        }}
        onKeyPress={() => {
          properties.onClick();
        }}
        onContextMenu={handleContextMenu}
        class="fill-[#00000000] stroke-slate-900 stroke-[0.05]"
      />
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
    <Board height={properties.height} width={properties.width} data={properties.fields}>
      {(field, index, x, y) => (
        <MineCell
          field={field}
          x={x()}
          y={y()}
          onClick={() => {
            properties.open(index());
          }}
          onContextMenu={() => properties.flag(index())}
        />
      )}
    </Board>
  );
};
