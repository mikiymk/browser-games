import type { JSXElement } from "solid-js";

import { splitProps } from "solid-js";

export type ImageBound = {
  readonly height?: number | string | undefined;
  readonly width?: number | string | undefined;
  readonly x?: number | string | undefined;
  readonly y?: number | string | undefined;
};
export const splitBounds = (properties: ImageBound): ImageBound => {
  return splitProps(properties, ["height", "width", "x", "y"])[0];
};

type UseProperties<T extends string> = ImageBound & {
  readonly id: T;
};
export const UseImage = <T extends string = string>(properties: UseProperties<T>): JSXElement => {
  return <use href={`#${properties.id}`} {...properties} />;
};
