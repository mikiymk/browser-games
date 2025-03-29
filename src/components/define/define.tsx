import type { JSXElement } from "solid-js";
import { define } from "./style.css.ts";

type DefineProperties = {
  readonly children: JSXElement;
};
export const Define = (properties: DefineProperties): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class={define}>
      <title>define</title>

      {properties.children}
    </svg>
  );
};
