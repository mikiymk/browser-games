import { For } from "solid-js";
import type { JSXElement } from "solid-js";

type InputDigitsProperties = {
  readonly numberOfDigits: number;
  readonly setDigits: (digits: readonly number[]) => void;
};

export const InputDigits = (properties: InputDigitsProperties): JSXElement => {
  return (
    <span>
      <For each={Array.from({ length: properties.numberOfDigits })}>{() => <input type="number" />}</For>
    </span>
  );
};
