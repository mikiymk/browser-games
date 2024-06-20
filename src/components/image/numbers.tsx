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
      class={`font-noto text-[10px] ${properties.class}`}
      style={{
        "text-anchor": "middle",
      }}
    >
      {properties.number}
    </text>
  );
};
