import type { JSXElement } from "solid-js";

import { HeaderButton } from "../../common/components/page-frame/header-button.tsx";
import { TEXT_START } from "../../scripts/constants.ts";

type StartButtonProperties = {
  readonly start: () => void;
};
export const Start = (properties: StartButtonProperties): JSXElement => {
  return (
    <button
      onClick={() => {
        properties.start();
      }}
      type="button"
    >
      <HeaderButton icon="replay">{TEXT_START}</HeaderButton>
    </button>
  );
};
