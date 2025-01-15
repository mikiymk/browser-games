import { HeaderPopup } from "@/components/page-header/header-popup";
import { TEXT_HOW_TO_PLAY } from "@/scripts/constants";
import type { JSXElement } from "solid-js";

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
