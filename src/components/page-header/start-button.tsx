import { HeaderButton } from "./header-button";
import type { JSXElement } from "solid-js";

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
