import type { JSXElement } from "solid-js";
import { HeaderButton } from "./header-button";

type StartButtonProperties = {
  readonly start: () => void;
};
export const StartButton = (properties: StartButtonProperties): JSXElement => {
  return (
    <button
      type="button"
      onClick={() => {
        properties.start();
      }}
    >
      <HeaderButton icon="replay">Start</HeaderButton>
    </button>
  );
};
