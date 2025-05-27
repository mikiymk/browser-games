import type { JSXElement } from "solid-js";

import { UseImage } from "../../common/components/use-image/use.tsx";
import { svg } from "./style.css.ts";

type UseSvgProperties = {
  readonly alt: string;
  readonly id?: string;
};
export const UseSvg = (properties: UseSvgProperties): JSXElement => {
  return (
    <svg class={svg} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <title>{properties.alt}</title>
      <UseImage id={properties.id} />
    </svg>
  );
};
