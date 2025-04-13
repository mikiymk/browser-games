import { For } from "solid-js";
import type { JSXElement } from "solid-js";
import { digits, digitsContainer } from "./style.css.ts";

type DigitsProperties = {
  readonly digits: readonly number[];
};

export const Digits = (properties: DigitsProperties): JSXElement => {
  return (
    <span class={digitsContainer}>
      <For each={properties.digits}>{(digit) => <span class={digits}>{digit}</span>}</For>
    </span>
  );
};
