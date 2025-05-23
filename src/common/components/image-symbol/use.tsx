import type { JSXElement } from "solid-js";

type UseProperties = {
  readonly height?: number | string | undefined;
  readonly id: string;
  readonly width?: number | string | undefined;
  readonly x?: number | string | undefined;
  readonly y?: number | string | undefined;
};
export const UseOtherSymbol = (properties: UseProperties): JSXElement => {
  return <use href={`#${properties.id}`} {...properties} />;
};
