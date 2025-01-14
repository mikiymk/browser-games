import type { JSXElement } from "solid-js";
import { HeaderButton } from "../page-header/header-button";
import { TEXT_START } from "@/scripts/constants";

type StartButtonProperties = {
  readonly start: () => void;
};
export const Start = (properties: StartButtonProperties): JSXElement => {
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
