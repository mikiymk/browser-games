import type { JSXElement } from "solid-js";
import { button } from "./style.css.ts";

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
      class={button}
    >
      {properties.children}
    </button>
  );
};
