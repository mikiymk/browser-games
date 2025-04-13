import type { JSXElement } from "solid-js";

import { button } from "./style.css.ts";

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
