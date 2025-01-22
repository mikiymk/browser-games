import icon from "@/images/theme-icon.svg";
import type { JSXElement } from "solid-js";
import Styles from "./style.module.css";

type PageHeaderProperites = {
  readonly buttons?: JSXElement;
};
export const PageHeader = (properties: PageHeaderProperites): JSXElement => {
  return (
    <div class={Styles.header}>
      <h1 class={Styles["header-title"]}>
        <a href="/browser-games/">
          <span class={Styles["header-button"]}>
            <img src={icon.src} alt="" class={Styles["header-icon"]} />
            <span class={Styles["header-text"]}>B-Games</span>
          </span>
        </a>
      </h1>

      {properties.buttons}
    </div>
  );
};
