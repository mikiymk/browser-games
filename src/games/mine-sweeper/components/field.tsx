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
import {
  closeFieldStyle,
  flagStyle,
  frontRectStyle,
  mineStyle,
  number1Style,
  number2Style,
  number3Style,
  number4Style,
  number5Style,
  number6Style,
  number7Style,
  number8Style,
  openFieldStyle,
} from "@/games/mine-sweeper/style.css";
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
        return [mine.src, mineStyle];
      case FieldFlag:
        return [flag.src, flagStyle];

      case FieldNumber1:
        return [number1.src, number1Style];
      case FieldNumber2:
        return [number2.src, number2Style];
      case FieldNumber3:
        return [number3.src, number3Style];
      case FieldNumber4:
        return [number4.src, number4Style];
      case FieldNumber5:
        return [number5.src, number5Style];
      case FieldNumber6:
        return [number6.src, number6Style];
      case FieldNumber7:
        return [number7.src, number7Style];
      case FieldNumber8:
        return [number8.src, number8Style];
      default:
        return;
    }
  };

  return (
    <>
      <rect
        x={properties.x}
        y={properties.y}
        height={10}
        width={10}
        class={isClosed() ? closeFieldStyle : openFieldStyle}
      />

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
        class={frontRectStyle}
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
