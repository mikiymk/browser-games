import type { JSXElement } from "solid-js";
import { anchor } from "./style.css.ts";

type ListProperties = {
  readonly href: string;
  readonly children: JSXElement;
};
export const Anchor = (properties: ListProperties): JSXElement => {
  return (
    <a href={properties.href} class={anchor}>
      {properties.children}
    </a>
  );
};
