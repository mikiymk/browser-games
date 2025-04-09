import { createEffect, createSignal, For } from "solid-js";
import type { JSXElement } from "solid-js";
import { input, inputContainer } from "./style.css.ts";

type InputDigitsProperties = {
  readonly numberOfDigits: number;
  readonly setDigits: (digits: readonly number[]) => void;
};

export const InputDigits = (properties: InputDigitsProperties): JSXElement => {
  const [innerDigits, setInnerDigits] = createSignal<readonly number[]>([]);
  createEffect(() => {
    setInnerDigits(Array.from({ length: properties.numberOfDigits }, () => 0));
  });

  return (
    <span class={inputContainer}>
      <For each={Array.from({ length: properties.numberOfDigits })}>
        {(_, index) => (
          <input
            type="number"
            class={input}
            min={0}
            max={9}
            onChange={(element) => {
              setInnerDigits((previous) => previous.with(index(), element.target.valueAsNumber));
            }}
          />
        )}
      </For>
      <button
        type="button"
        onClick={() => {
          properties.setDigits(innerDigits());
        }}
      >
        Submit
      </button>
    </span>
  );
};
