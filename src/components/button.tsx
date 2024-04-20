import type { JSXElement } from "solid-js";

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
      class="underline decoration-black decoration-double mx-1"
    >
      {properties.children}
    </button>
  );
};
