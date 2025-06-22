import { UseImage } from "../use-image/use.tsx";
import { svg } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type UseSvgProperties = {
  readonly alt: string;
  readonly id?: string;
};

/**
 * 定義した画像を使用する
 * @param properties - プロパティ
 * @returns 要素
 */
export const UseSvg = (properties: UseSvgProperties): JSXElement => {
  return (
    <svg class={svg} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <title>{properties.alt}</title>
      <UseImage id={properties.id} />
    </svg>
  );
};
