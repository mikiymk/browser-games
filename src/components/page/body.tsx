import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";

type PageBodyProperties = {
  readonly children: JSXElement;
};
export const PageBody = (properties: PageBodyProperties): JSXElement => {
  return <div class={Styles.body}>{properties.children}</div>;
};
