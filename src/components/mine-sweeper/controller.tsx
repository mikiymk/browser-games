import type { JSXElement } from "solid-js";

type ControllerProperties = {
  readonly message: string;

  readonly reset: () => void;
};

export const Controller = (properties: ControllerProperties): JSXElement => {
  return (
    <div>
      status:
      <output>{properties.message}</output>
      <button
        type="button"
        onClick={() => {
          properties.reset();
        }}
      >
        reset
      </button>
    </div>
  );
};
