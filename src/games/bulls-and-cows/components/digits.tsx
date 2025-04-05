import { For } from "solid-js";
import type { JSXElement } from "solid-js";

type DigitsProperties = {
  readonly digits: readonly number[];
};

export const Digits = (properties: DigitsProperties): JSXElement => {
  return (
    <span>
      <For each={properties.digits}>{(digit) => <span>{digit}</span>}</For>
    </span>
  );
};
