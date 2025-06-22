import { themeIcon } from "../../../images/image-sources.ts";
import { body, header, headerButton, headerIcon, headerText, headerTitle } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type PageBodyProperties = {
  readonly children?: JSXElement;
  readonly header?: JSXElement;
};

/**
 * ページのフレーム
 * @param properties - プロパティ
 * @returns 要素
 */
export const Page = (properties: PageBodyProperties): JSXElement => {
  return (
    <>
      <div class={header}>
        <TitleLink />
        {properties.header}
      </div>
      <div class={body}>{properties.children}</div>
    </>
  );
};

/**
 * トップページへのリンク
 * @returns 要素
 */
const TitleLink = (): JSXElement => {
  return (
    <h1 class={headerTitle}>
      <a href="/browser-games/">
        <span class={headerButton}>
          <img alt="Browser Games" class={headerIcon} src={themeIcon} />
          <span class={headerText}>B-Games</span>
        </span>
      </a>
    </h1>
  );
};
