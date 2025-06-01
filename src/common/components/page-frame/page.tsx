import type { JSXElement } from "solid-js";

import icon from "../../../images/theme-icon.svg";
import { body, header, headerButton, headerIcon, headerText, headerTitle } from "./style.css.ts";

type PageBodyProperties = {
  readonly children?: JSXElement;
  readonly header?: JSXElement;
};
export const Page = (properties: PageBodyProperties): JSXElement => {
  return (
    <>
      <div class={header}>
        <h1 class={headerTitle}>
          <a href="/browser-games/">
            <span class={headerButton}>
              <img alt="Browser Games" class={headerIcon} src={icon.src} />
              <span class={headerText}>B-Games</span>
            </span>
          </a>
        </h1>

        {properties.header}
      </div>
      <div class={body}>{properties.children}</div>
    </>
  );
};
