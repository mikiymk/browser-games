import type { JSXElement } from "solid-js";
import { headerMaterialIcon } from "./style.css.ts";

type Properties = {
  readonly children: string;
};
export const Icon = (properties: Properties): JSXElement => {
  return <span class={headerMaterialIcon}>{properties.children}</span>;
};
