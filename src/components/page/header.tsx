import type { JSXElement } from "solid-js";
import icon from "../../images/theme-icon.svg";
import { header, headerButton, headerIcon, headerText, headerTitle } from "./style.css.ts";

type PageHeaderProperites = {
  readonly buttons?: JSXElement;
};

export const PageHeader = (properties: PageHeaderProperites): JSXElement => {
  return (
    <div class={header}>
      <h1 class={headerTitle}>
        <a href="/browser-games/">
          <span class={headerButton}>
            <img src={icon.src} alt="" class={headerIcon} />
            <span class={headerText}>B-Games</span>
          </span>
        </a>
      </h1>

      {properties.buttons}
    </div>
  );
};
