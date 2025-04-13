import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import { radio, radioInput } from "./style.css.ts";

type RadioProperties<T> = {
  readonly name: string;
  readonly setValue: (value: T) => void;

  readonly value: T;
  readonly values: readonly {
    readonly label: string;
    readonly value: T;
  }[];
};
export const Radio = <T,>(properties: RadioProperties<T>): JSXElement => {
  return (
    <For each={properties.values}>
      {(value) => {
        return (
          <label class={radio}>
            <input
              checked={value.value === properties.value}
              class={radioInput}
              name={properties.name}
              onChange={() => {
                properties.setValue(value.value);
              }}
              type="radio"
            />

            {value.label}
          </label>
        );
      }}
    </For>
  );
};
