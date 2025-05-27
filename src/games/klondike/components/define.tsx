import type { JSXElement } from "solid-js";

import { Show } from "solid-js";

import type { CardId } from "../../../common/components/image/id.ts";
import type { Card } from "../card.ts";

import { selected } from "./style.css.ts";

type UseCardProperties = {
  readonly card: "back" | "empty" | Card;

  readonly handleClick?: () => void;
  readonly handleDoubleClick?: () => void;

  readonly selected?: boolean;
  readonly x: number;

  readonly y: number;
};
export const UseCard = (properties: UseCardProperties): JSXElement => {
  return (
    <>
      <use
        height={31.2}
        href={`#card-${properties.card}` satisfies `#${CardId}`}
        onClick={() => {
          return properties.handleClick?.();
        }}
        onDblClick={() => {
          return properties.handleDoubleClick?.();
        }}
        onKeyDown={() => {
          return properties.handleClick?.();
        }}
        width={20}
        x={properties.x}
        y={properties.y}
      />
      <Show when={properties.selected}>
        <rect class={selected} height={31.2} rx={2} ry={2} width={20} x={properties.x} y={properties.y} />
      </Show>
    </>
  );
};
