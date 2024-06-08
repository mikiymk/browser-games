import type { JSXElement } from "solid-js";

type PageBodyProperties = {
  readonly children: JSXElement;
};
export const PageBody = (properties: PageBodyProperties): JSXElement => {
  return <div class=" h-[calc(100dvh-3rem)] bg-amber-100 flex flex-col items-center">{properties.children}</div>;
};
