import type { JSXElement } from "solid-js";

import { Show, splitProps } from "solid-js";

type UseProperties<T extends string> = {
  readonly height?: number | string | undefined;
  readonly id: T | undefined;
  readonly width?: number | string | undefined;
  readonly x?: number | string | undefined;
  readonly y?: number | string | undefined;
};

/** 定義した画像をSVGの中で使用する */
export const UseImage = <T extends string = string>(properties: UseProperties<T>): JSXElement => {
  const [_id, others] = splitProps(properties, ["id"]);
  return <Show when={properties.id}>{(id) => <use href={`#${id()}`} {...others} />}</Show>;
};
