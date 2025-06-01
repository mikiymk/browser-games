import type { JSXElement } from "solid-js";

import { HeaderPopup } from "../../common/components/page-frame/header-popup.tsx";
import { TEXT_HOW_TO_PLAY } from "../../scripts/constants.ts";

type HowToPlayProperties = {
  readonly children: JSXElement;
};
export const HowToPlay = (properties: HowToPlayProperties): JSXElement => {
  return (
    <HeaderPopup icon="help" label={TEXT_HOW_TO_PLAY}>
      <h2>{TEXT_HOW_TO_PLAY}</h2>

      {properties.children}
    </HeaderPopup>
  );
};
