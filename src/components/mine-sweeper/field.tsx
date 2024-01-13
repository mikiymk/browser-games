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
import type { JSXElement } from "solid-js";
import { For, Show } from "solid-js";
import mine from "@/images/symbol/mine.svg";
import flag from "@/images/symbol/flag.svg";
import number1 from "@/images/number/1.svg";
import number2 from "@/images/number/2.svg";
import number3 from "@/images/number/3.svg";
import number4 from "@/images/number/4.svg";
import number5 from "@/images/number/5.svg";
import number6 from "@/images/number/6.svg";
import number7 from "@/images/number/7.svg";
import number8 from "@/images/number/8.svg";

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
        return [mine.src, "mine"];
      case FieldFlag:
        return [flag.src, "flag"];

      case FieldNumber1:
        return [number1.src, "n1"];
      case FieldNumber2:
        return [number2.src, "n2"];
      case FieldNumber3:
        return [number3.src, "n3"];
      case FieldNumber4:
        return [number4.src, "n4"];
      case FieldNumber5:
        return [number5.src, "n5"];
      case FieldNumber6:
        return [number6.src, "n6"];
      case FieldNumber7:
        return [number7.src, "n7"];
      case FieldNumber8:
        return [number8.src, "n8"];
      default:
        return;
    }
  };

  return (
    <>
      <rect x={properties.x} y={properties.y} height={1} width={1} class={isClosed() ? "field-close" : "field-open"} />

      <Show when={imageSource()}>
        {(source) => (
          <use
            href={`${source()[0]}#root`}
            x={properties.x}
            y={properties.y}
            height={1}
            width={1}
            class={`graph ${source()[1]}`}
          />
        )}
      </Show>

      <rect
        x={properties.x}
        y={properties.y}
        height={1}
        width={1}
        fill="#0000"
        stroke="black"
        stroke-width={0.05}
        tabindex={0}
        onClick={() => {
          properties.onClick();
        }}
        onKeyPress={() => {
          properties.onClick();
        }}
        onContextMenu={handleContextMenu}
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
    <svg viewBox={`0 0 ${properties.width} ${properties.height}`} xmlns="http://www.w3.org/2000/svg">
      <title>mine sweeper field</title>

      <For each={properties.fields}>
        {(field, index) => (
          <MineCell
            field={field}
            x={index() % properties.width}
            y={Math.floor(index() / properties.width)}
            onClick={() => {
              properties.open(index());
            }}
            onContextMenu={() => properties.flag(index())}
          />
        )}
      </For>
    </svg>
  );
};
