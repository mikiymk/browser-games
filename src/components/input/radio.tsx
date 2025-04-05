import type { JSXElement } from "solid-js";
import { For } from "solid-js";
import { radio, radioInput } from "./style.css.ts";

type RadioProperties<T> = {
  readonly name: string;
  readonly values: readonly {
    readonly value: T;
    readonly label: string;
  }[];

  readonly value: T;
  readonly setValue: (value: T) => void;
};
export const Radio = <T,>(properties: RadioProperties<T>): JSXElement => {
  return (
    <For each={properties.values}>
      {(value) => {
        return (
          <label class={radio}>
            <input
              type="radio"
              name={properties.name}
              checked={value.value === properties.value}
              class={radioInput}
              onChange={() => {
                properties.setValue(value.value);
              }}
            />

            {value.label}
          </label>
        );
      }}
    </For>
  );
};
