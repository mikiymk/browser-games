import type { JSXElement } from "solid-js";
import icon from "@/images/theme-icon.svg";

type PageHeaderProperites = {
  readonly buttons?: JSXElement;
};
export const PageHeader = (properties: PageHeaderProperites): JSXElement => {
  return (
    <div class=" h-12 bg-orange-300 px-2 ">
      <h1>
        <a href="/browser-games/" class=" flex flex-row  items-center gap-2 h-12 text-xl ">
          <img src={icon.src} alt="" class=" h-8 " />
          <span>B-Games</span>
        </a>
      </h1>

      {properties.buttons}
    </div>
  );
};
