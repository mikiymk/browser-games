import type { JSXElement } from "solid-js";
import { svg, svgUse } from "./style.css.ts";

type StyledSvgProperties = {
  readonly src: string;
  readonly alt: string;
  readonly class?: string;
};
export const StyledSvg = (properties: StyledSvgProperties): JSXElement => {
  return (
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class={svg}>
      <title>{properties.alt}</title>
      <use href={`${properties.src}#root`} class={properties.class ?? svgUse} />
    </svg>
  );
};
