import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";
import { Icon } from "@/components/elements/material-icon";

type HeaderButtonProperites = {
  readonly icon?: string | undefined;
  readonly children: string;
};
export const HeaderButton = (properties: HeaderButtonProperites): JSXElement => {
  return (
    <span class={Styles["header-button"]}>
      <Show when={properties.icon}>{(icon) => <Icon>{icon()}</Icon>}</Show>
      <span class={Styles["header-text"]}>{properties.children}</span>
    </span>
  );
};
