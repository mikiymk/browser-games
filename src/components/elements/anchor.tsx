import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";

type ListProperties = {
  readonly href: string;
  readonly children: JSXElement;
};
export const Anchor = (properties: ListProperties): JSXElement => {
  return (
    <a href={properties.href} class={Styles.anchor}>
      {properties.children}
    </a>
  );
};
