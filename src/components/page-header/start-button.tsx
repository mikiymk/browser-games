import { HeaderButton } from "./header-button";
import start from "@/images/icon/start.svg";
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
      <HeaderButton icon={start.src}>Start</HeaderButton>
    </button>
  );
};
