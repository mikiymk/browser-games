import type { JSXElement } from "solid-js";
import icon from "@/images/theme-icon.svg";


type PageHeaderProperites = {
  readonly buttons?: JSXElement;
};
export const PageHeader = (properties: PageHeaderProperites): JSXElement => {
  return (
    <div class="h-12 text-xl bg-orange-300 px-2 flex flex-row items-center gap-2">
      <h1 class="flex-1">
        <a href="/browser-games/">
          <span class="w-max px-2 flex flex-row items-center gap-2 border-4 border-orange-500 [border-style:outset] active:[border-style:inset] rounded">
            <img src={icon.src} alt="" class="h-8 aspect-square" />
            <span class="hidden sm:inline">B-Games</span>
          </span>
        </a>
      </h1>

      {properties.buttons}
    </div>
  );
};
