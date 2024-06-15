import type { JSXElement } from "solid-js";

type ControllerProperties = {
  readonly message: string;
};

export const Status = (properties: ControllerProperties): JSXElement => {
  return <output class="font-noto-emoji">{properties.message}</output>;
};
