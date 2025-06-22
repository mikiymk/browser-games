import { Show } from "solid-js";

import type { JSXElement } from "solid-js";

type UseProperties<T extends string> = {
  readonly height?: number | string | undefined;
  readonly id: T | undefined;
  readonly width?: number | string | undefined;
  readonly x?: number | string | undefined;
  readonly y?: number | string | undefined;
};

/**
 * 定義した画像をSVGの中で使用する
 * @param properties - プロパティ
 * @returns 要素
 */
export const UseImage = <T extends string = string>(properties: UseProperties<T>): JSXElement => {
  return (
    <Show when={properties.id}>
      {(id) => (
        <use height={properties.height} href={`#${id()}`} width={properties.width} x={properties.x} y={properties.y} />
      )}
    </Show>
  );
};
