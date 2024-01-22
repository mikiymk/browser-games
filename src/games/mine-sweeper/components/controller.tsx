import { buttonStyle } from "@/styles/common.css";
import type { JSXElement } from "solid-js";

type ControllerProperties = {
  readonly message: string;

  readonly reset: () => void;
};

export const Controller = (properties: ControllerProperties): JSXElement => {
  return (
    <>
      <p>
        status:
        <output>{properties.message}</output>
      </p>
      <button
        type="button"
        onClick={() => {
          properties.reset();
        }}
        class={buttonStyle}
      >
        reset
      </button>
    </>
  );
};
