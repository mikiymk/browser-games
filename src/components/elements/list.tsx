import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";

type ListProperties = {
  readonly children: JSXElement;
};
export const List = (properties: ListProperties): JSXElement => {
  return <ul class={Styles.list}>{properties.children}</ul>;
};

export const OrderedList = (properties: ListProperties): JSXElement => {
  return <ol class={Styles.orderedList}>{properties.children}</ol>;
};

type ListItemProperties = {
  readonly children: JSXElement;
};
export const ListItem = (properties: ListItemProperties): JSXElement => {
  return <li class={Styles["list-item"]}>{properties.children}</li>;
};
