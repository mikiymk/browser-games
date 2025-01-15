import { Show } from "solid-js";
import type { JSXElement } from "solid-js";

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
      {(id) => <use href={`#${id()}`} x={properties.x} y={properties.y} height={10} width={10} />}
    </Show>
  );
};
