import { anchor } from "./style.css.ts";

import type { JSXElement } from "solid-js";

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
