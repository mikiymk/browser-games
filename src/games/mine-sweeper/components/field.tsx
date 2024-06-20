import { Board } from "@/components/board/board";
import { Numbers } from "@/components/image/numbers";
import { Use } from "@/components/image/use";
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
import type { JSXElement } from "solid-js";
import { Match, Switch } from "solid-js";

type MineCellProperties = {
  readonly field: number;
  readonly x: number;
  readonly y: number;
};
const MineCell = (properties: MineCellProperties): JSXElement => {
  const Closed = (): JSXElement => {
    return <rect x={properties.x} y={properties.y} height={10} width={10} class="fill-slate-400" />;
  };

  return (
    <>
      <Switch>
        <Match when={properties.field === FieldBomb}>
          <Closed />
          <Use href={mine.src} x={properties.x} y={properties.y} class="fill-slate-900 stroke-slate-900" />
        </Match>
        <Match when={properties.field === FieldFlag}>
          <Closed />
          <Use href={flag.src} x={properties.x} y={properties.y} class="fill-red-500 stroke-slate-900" />
        </Match>
        <Match when={properties.field === FieldNoOpen}>
          <Closed />
        </Match>

        <Match when={properties.field === FieldNumber1}>
          <Numbers number={1} x={properties.x} y={properties.y} class="fill-blue-500" />
        </Match>
        <Match when={properties.field === FieldNumber2}>
          <Numbers number={2} x={properties.x} y={properties.y} class="fill-green-500" />
        </Match>
        <Match when={properties.field === FieldNumber3}>
          <Numbers number={3} x={properties.x} y={properties.y} class="fill-red-500" />
        </Match>
        <Match when={properties.field === FieldNumber4}>
          <Numbers number={4} x={properties.x} y={properties.y} class="fill-fuchsia-500" />
        </Match>
        <Match when={properties.field === FieldNumber5}>
          <Numbers number={5} x={properties.x} y={properties.y} class="fill-red-800" />
        </Match>
        <Match when={properties.field === FieldNumber6}>
          <Numbers number={6} x={properties.x} y={properties.y} class="fill-teal-400" />
        </Match>
        <Match when={properties.field === FieldNumber7}>
          <Numbers number={7} x={properties.x} y={properties.y} class="fill-slate-900" />
        </Match>
        <Match when={properties.field === FieldNumber8}>
          <Numbers number={8} x={properties.x} y={properties.y} class="fill-stone-500" />
        </Match>
      </Switch>

      <rect x={properties.x} y={properties.y} height={10} width={10} class="fill-none stroke-slate-900 stroke-[0.05]" />
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
