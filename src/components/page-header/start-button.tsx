import type { JSXElement } from "solid-js";
import { HeaderButton } from "./header-button";
import { TEXT_START } from "@/scripts/constants";

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
      <HeaderButton icon="replay">{TEXT_START}</HeaderButton>
    </button>
  );
};
