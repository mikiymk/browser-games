import type { JSXElement } from "solid-js";

import { Show } from "solid-js";

type UseProperties<T extends number | string | undefined> = {
  readonly id: T;

  readonly x: number;
  readonly y: number;
};
export const Use = <T extends number | string | undefined = number | string | undefined>(
  properties: UseProperties<T>,
): JSXElement => {
  return (
    <Show when={properties.id}>
      {(id) => <use height={10} href={`#${id()}`} width={10} x={properties.x} y={properties.y} />}
    </Show>
  );
};
