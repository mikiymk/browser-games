import type { JSXElement } from "solid-js";

type UseProperties = {
  readonly href: string;
  readonly x: number;
  readonly y: number;

  readonly class: string;
};
export const Use = (properties: UseProperties): JSXElement => {
  return (
    <use
      href={`${properties.href}#root`}
      x={properties.x}
      y={properties.y}
      height={10}
      width={10}
      class={`stroke-2 ${properties.class}`}
    />
  );
};
