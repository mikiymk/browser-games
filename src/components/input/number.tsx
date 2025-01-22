import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";

type InputNumberProperties = {
  readonly name: string;

  readonly value: number;
  readonly setValue: (value: number) => void;
};
export const InputNumber = (properties: InputNumberProperties): JSXElement => {
  return (
    <input
      type="number"
      name={properties.name}
      value={properties.value}
      onChange={(event) => {
        properties.setValue(Number.parseInt(event.currentTarget.value));
      }}
      class={Styles.number}
    />
  );
};
