import type { JSXElement } from "solid-js";

type ControllerProperties = {
  readonly message: string;
};

export const Status = (properties: ControllerProperties): JSXElement => {
  return <output>{properties.message}</output>;
};
