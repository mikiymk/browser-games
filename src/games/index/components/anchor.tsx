import type { JSXElement } from "solid-js";

import { anchor } from "./style.css.ts";

type ListProperties = {
  readonly children: JSXElement;
  readonly href: string;
};
export const Anchor = (properties: ListProperties): JSXElement => {
  return (
    <a class={anchor} href={properties.href}>
      {properties.children}
    </a>
  );
};
