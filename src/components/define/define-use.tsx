import type { JSXElement } from "solid-js";

type DefineUseProperties = {
  readonly class?: string | undefined;
  readonly href: string;
  readonly id: string;
};
export const DefineUse = (properties: DefineUseProperties): JSXElement => {
  return (
    <symbol id={properties.id} viewBox="0 0 60 60">
      <use class={properties.class} href={`${properties.href}#root`} />
    </symbol>
  );
};
