import { For } from "solid-js";
import type { JSXElement } from "solid-js";
import { input, inputContainer } from "./style.css.ts";

type InputDigitsProperties = {
  readonly numberOfDigits: number;
  readonly setDigits: (digits: readonly number[]) => void;
};

export const InputDigits = (properties: InputDigitsProperties): JSXElement => {
  return (
    <span class={inputContainer}>
      <For each={Array.from({ length: properties.numberOfDigits })}>
        {() => <input type="number" class={input} value="0" />}
      </For>
    </span>
  );
};
