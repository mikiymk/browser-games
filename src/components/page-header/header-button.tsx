import { Show } from "solid-js";
import type { JSXElement } from "solid-js";

type HeaderButtonProperites = {
  readonly icon?: string | undefined;
  readonly children: string;
};
export const HeaderButton = (properties: HeaderButtonProperites): JSXElement => {
  return (
    <span class="w-max px-2 flex flex-row items-center gap-2 border-4 border-orange-500 [border-style:outset] active:[border-style:inset] rounded">
      <Show when={properties.icon}>{(icon) => <span class="material-symbols-rounded">{icon()}</span>}</Show>
      <span class="hidden sm:inline">{properties.children}</span>
    </span>
  );
};
