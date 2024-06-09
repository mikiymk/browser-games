import type { JSXElement } from "solid-js";
import { For } from "solid-js";

type SelectRadioProperties<T> = {
  readonly name: string;
  readonly values: readonly {
    readonly value: T;
    readonly label: string;
  }[];

  readonly value: T;
  readonly setValue: (value: T) => void;
};
export const SelectRadio = <T,>(properties: SelectRadioProperties<T>): JSXElement => {
  return (
    <For each={properties.values}>
      {(value) => {
        return (
          <label class="px-2 has-[:checked]:bg-lime-200 rounded">
            <input
              type="radio"
              name={properties.name}
              checked={value.value === properties.value}
              class="hidden"
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
