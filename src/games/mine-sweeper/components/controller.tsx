import { Button } from "@/components/button";
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
      <Button
        onClick={() => {
          properties.reset();
        }}
      >
        reset
      </Button>
    </>
  );
};
