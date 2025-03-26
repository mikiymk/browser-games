import { Icon } from "@/components/elements/material-icon";
import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { headerButton, headerText } from "./style.css.ts";

type HeaderButtonProperites = {
  readonly icon?: string | undefined;
  readonly children: string;
};
export const HeaderButton = (properties: HeaderButtonProperites): JSXElement => {
  return (
    <span class={headerButton}>
      <Show when={properties.icon}>{(icon) => <Icon>{icon()}</Icon>}</Show>
      <span class={headerText}>{properties.children}</span>
    </span>
  );
};
