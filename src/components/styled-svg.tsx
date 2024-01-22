import { defaultIconStyle, defaultStrokeStyle } from "@/styles/common.css";
import type { JSXElement } from "solid-js";

type StyledSvgProperties = {
  readonly src: string;
  readonly alt: string;
  readonly class?: string;
  readonly style?: string;
};
export const StyledSvg = (properties: StyledSvgProperties): JSXElement => {
  return (
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class={properties.class ?? defaultIconStyle}>
      <title>{properties.alt}</title>
      <use href={`${properties.src}#root`} class={properties.style ?? defaultStrokeStyle} />
    </svg>
  );
};
