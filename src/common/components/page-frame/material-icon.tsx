import { materialSymbols } from "../../../styles/fonts.css.ts";

import type { JSXElement } from "solid-js";

type Properties = {
  readonly children: string;
};

/**
 * マテリアルアイコン
 * @param properties - プロパティ
 * @returns 要素
 */
export const Icon = (properties: Properties): JSXElement => {
  return <span class={materialSymbols}>{properties.children}</span>;
};
