import {
  FieldBomb,
  FieldFlag,
  FieldNoOpen,
  FieldNumber0,
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
import { For, Match, Switch } from "solid-js";
import { Bomb, Flag, Number1, Number2, Number3, Number4, Number5, Number6, Number7, Number8 } from "./graphic";

type MineCellProperties = {
  readonly field: number;
  readonly onClick: () => void;
  readonly onContextMenu: () => boolean;
};
const MineCell = (properties: MineCellProperties): JSXElement => {
  const handleContextMenu = (event: MouseEvent): void => {
    if (properties.onContextMenu()) {
      event.preventDefault();
    }
  };

  return (
    <div
      class="field"
      onClick={() => {
        properties.onClick();
      }}
      onKeyPress={() => {
        properties.onClick();
      }}
      onContextMenu={handleContextMenu}
    >
      <Switch>
        <Match when={properties.field === FieldBomb}>
          <div class="field-close">
            <Bomb />
          </div>
        </Match>
        <Match when={properties.field === FieldFlag}>
          <div class="field-close">
            <Flag />
          </div>
        </Match>
        <Match when={properties.field === FieldNoOpen}>
          <div class="field-close" />
        </Match>
        <Match when={properties.field === FieldNumber0}>
          <div class="field-open" />
        </Match>
        <Match when={properties.field === FieldNumber1}>
          <div class="field-open">
            <Number1 />
          </div>
        </Match>
        <Match when={properties.field === FieldNumber2}>
          <div class="field-open">
            <Number2 />
          </div>
        </Match>
        <Match when={properties.field === FieldNumber3}>
          <div class="field-open">
            <Number3 />
          </div>
        </Match>
        <Match when={properties.field === FieldNumber4}>
          <div class="field-open">
            <Number4 />
          </div>
        </Match>
        <Match when={properties.field === FieldNumber5}>
          <div class="field-open">
            <Number5 />
          </div>
        </Match>
        <Match when={properties.field === FieldNumber6}>
          <div class="field-open">
            <Number6 />
          </div>
        </Match>
        <Match when={properties.field === FieldNumber7}>
          <div class="field-open">
            <Number7 />
          </div>
        </Match>
        <Match when={properties.field === FieldNumber8}>
          <div class="field-open">
            <Number8 />
          </div>
        </Match>
      </Switch>
    </div>
  );
};

type MineFieldsProperties = {
  readonly width: number;
  readonly fields: readonly number[];

  readonly open: (index: number) => void;
  readonly flag: (index: number) => boolean;
};
export const MineFields = (properties: MineFieldsProperties): JSXElement => {
  return (
    <div
      class="grid"
      style={{
        "grid-template-columns": `repeat(${properties.width}, 1fr)`,
      }}
    >
      <For each={properties.fields}>
        {(field, index) => (
          <MineCell
            field={field}
            onClick={() => {
              properties.open(index());
            }}
            onContextMenu={() => properties.flag(index())}
          />
        )}
      </For>
    </div>
  );
};
