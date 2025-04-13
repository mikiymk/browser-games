import type { JSXElement } from "solid-js";
import icon from "../../images/theme-icon.svg";
import { body, header, headerButton, headerIcon, headerText, headerTitle } from "./style.css.ts";

type PageBodyProperties = {
  readonly header?: JSXElement;
  readonly children: JSXElement;
};
export const Page = (properties: PageBodyProperties): JSXElement => {
  return (
    <>
      <div class={header}>
        <h1 class={headerTitle}>
          <a href="/browser-games/">
            <span class={headerButton}>
              <img src={icon.src} alt="Browser Games" class={headerIcon} />
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
