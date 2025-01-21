import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";

type ButtonProperties = {
  readonly onClick?: (event: MouseEvent) => void;
  readonly children: JSXElement;
};
export const Button = (properties: ButtonProperties): JSXElement => {
  return (
    <button
      type="button"
      onClick={(event: MouseEvent) => {
        properties.onClick?.(event);
      }}
      class={Styles.button}
    >
      {properties.children}
    </button>
  );
};
