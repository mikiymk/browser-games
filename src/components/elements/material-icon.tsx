import type { JSXElement } from "solid-js";
import { icon } from "./style.css.ts";

type Properties = {
  readonly children: string;
};
export const Icon = (properties: Properties): JSXElement => {
  return <span class={icon}>{properties.children}</span>;
};
