import type { JSXElement } from "solid-js";

type DefineUseProperties = {
  readonly id: string;
  readonly href: string;
  readonly class: string;
};
export const DefineUse = (properties: DefineUseProperties): JSXElement => {
  return (
    <symbol id={properties.id} viewBox="0 0 60 60">
      <use href={`${properties.href}#root`} class={properties.class} />
    </symbol>
  );
};
