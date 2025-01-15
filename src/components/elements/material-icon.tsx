import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";

type Properties = {
  readonly children: string;
};
export const Icon = (properties: Properties): JSXElement => {
  return <span class={Styles.icon}>{properties.children}</span>;
};
