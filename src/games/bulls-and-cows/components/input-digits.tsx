import { createEffect, createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import { input, inputContainer } from "./style.css.ts";

type InputDigitsProperties = {
  readonly numberOfDigits: number;
  readonly setDigits: (digits: readonly number[]) => void;
};

export const InputDigits = (properties: InputDigitsProperties): JSXElement => {
  const [innerDigits, setInnerDigits] = createSignal<number>(0);
  const innerDigitsArray = (): readonly number[] => {
    let digits = innerDigits();
    return Array.from({ length: properties.numberOfDigits }, () => {
      const digit = digits % 10;
      digits = Math.floor(digits / 10);
      return digit;
    }).toReversed();
  };

  createEffect(() => setInnerDigits(0));

  return (
    <span class={inputContainer}>
      <input type="number" class={input} onChange={(element) => setInnerDigits(element.target.valueAsNumber)} />
      <button type="button" onClick={() => properties.setDigits(innerDigitsArray())}>
        Submit
      </button>
    </span>
  );
};
