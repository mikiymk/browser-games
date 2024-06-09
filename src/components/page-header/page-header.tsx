import type { JSXElement } from "solid-js";
import icon from "@/images/theme-icon.svg";
import { HeaderButton } from "./header-button";

type PageHeaderProperites = {
  readonly buttons?: JSXElement;
};
export const PageHeader = (properties: PageHeaderProperites): JSXElement => {
  return (
    <div class="h-12 text-xl bg-orange-300 px-2 flex flex-row items-center gap-2">
      <h1 class="flex-1">
        <a href="/browser-games/" >
          <HeaderButton icon={icon.src}>B-Games</HeaderButton>
        </a>
      </h1>

      {properties.buttons}
    </div>
  );
};
