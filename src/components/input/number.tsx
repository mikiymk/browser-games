import type { JSXElement } from "solid-js";

import { number } from "./style.css.ts";

type InputNumberProperties = {
  readonly name: string;

  readonly setValue: (value: number) => void;
  readonly value: number;
};
export const InputNumber = (properties: InputNumberProperties): JSXElement => {
  return (
    <input
      class={number}
      name={properties.name}
      onChange={(event) => {
        properties.setValue(Number.parseInt(event.currentTarget.value));
      }}
      type="number"
      value={properties.value}
    />
  );
};
