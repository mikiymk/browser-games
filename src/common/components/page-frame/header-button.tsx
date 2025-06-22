import { Show } from "solid-js";

import { Icon } from "./material-icon.tsx";
import { headerButton, headerText } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type HeaderButtonProperites = {
  readonly children: string;
  readonly icon?: string | undefined;
};

/**
 * 上部のボタン
 * @param properties - プロパティ
 * @returns 要素
 */
export const HeaderButton = (properties: HeaderButtonProperites): JSXElement => {
  return (
    <span class={headerButton}>
      <Show when={properties.icon}>{(icon) => <Icon>{icon()}</Icon>}</Show>
      <span class={headerText}>{properties.children}</span>
    </span>
  );
};
