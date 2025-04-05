import type { JSXElement } from "solid-js";
import { body } from "./style.css.ts";

type PageBodyProperties = {
  readonly children: JSXElement;
};
export const PageBody = (properties: PageBodyProperties): JSXElement => {
  return <div class={body}>{properties.children}</div>;
};
