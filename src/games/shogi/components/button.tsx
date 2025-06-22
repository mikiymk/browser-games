import { button } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type ButtonProperties = {
  readonly children: JSXElement;
  readonly onClick?: (event: MouseEvent) => void;
};
export const Button = (properties: ButtonProperties): JSXElement => {
  return (
    <button
      class={button}
      onClick={(event: MouseEvent) => {
        properties.onClick?.(event);
      }}
      type="button"
    >
      {properties.children}
    </button>
  );
};
