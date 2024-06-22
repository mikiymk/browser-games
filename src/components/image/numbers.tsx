import type { JSXElement } from "solid-js";

type NumbersProperties = {
  readonly x: number;
  readonly y: number;
  readonly class: string;

  readonly number: number;
};
export const Numbers = (properties: NumbersProperties): JSXElement => {
  return (
    <text
      x={properties.x + 5}
      y={properties.y + 9}
      class={`font-noto-jp text-[10px] stroke-none anchor-mid ${properties.class}`}
    >
      {properties.number}
    </text>
  );
};
