import type { JSXElement } from "solid-js";

import { themeIcon } from "../../../images/image-sources.ts";
import { body, header, headerButton, headerIcon, headerText, headerTitle } from "./style.css.ts";

type PageBodyProperties = {
  readonly children?: JSXElement;
  readonly header?: JSXElement;
};

/** ページのフレーム */
export const Page = (properties: PageBodyProperties): JSXElement => {
  return (
    <>
      <div class={header}>
        <h1 class={headerTitle}>
          <a href="/browser-games/">
            <span class={headerButton}>
              <img alt="Browser Games" class={headerIcon} src={themeIcon} />
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
