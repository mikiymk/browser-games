import type { JSXElement } from "solid-js";

import { svg, svgUse } from "./style.css.ts";

type StyledSvgProperties = {
  readonly alt: string;
  readonly class?: string;
  readonly src: string;
};
export const StyledSvg = (properties: StyledSvgProperties): JSXElement => {
  return (
    <svg class={svg} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <title>{properties.alt}</title>
      <use class={properties.class ?? svgUse} href={`${properties.src}#root`} />
    </svg>
  );
};
