import type { JSXElement } from "solid-js";
import { list, listItem } from "./style.css.ts";

type ListProperties = {
  readonly children: JSXElement;
};
export const List = (properties: ListProperties): JSXElement => {
  return <ul class={list}>{properties.children}</ul>;
};

type ListItemProperties = {
  readonly children: JSXElement;
};
export const ListItem = (properties: ListItemProperties): JSXElement => {
  return <li class={listItem}>{properties.children}</li>;
};
