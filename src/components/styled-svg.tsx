import type { JSXElement } from "solid-js";

type StyledSvgProperties = {
  readonly src: string;
  readonly alt: string;
  readonly class?: string;
};
export const StyledSvg = (properties: StyledSvgProperties): JSXElement => {
  return (
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 inline aspect-square">
      <title>{properties.alt}</title>
      <use href={`${properties.src}#root`} class={properties.class ?? "fill-none stroke-slate-900 stroke-2"} />
    </svg>
  );
};
