import { HeaderPopup } from "@/components/page-header/header-popup";
import { TEXT_HOW_TO_PLAY, TEXT_HOW_TO_PLAY_KNIGHT_TOUR } from "@/scripts/constants";
import type { JSXElement } from "solid-js";

export const HowToPlay = (): JSXElement => {
  return (
    <HeaderPopup icon="help" label={TEXT_HOW_TO_PLAY}>
      <h2>{TEXT_HOW_TO_PLAY}</h2>

      <p>{TEXT_HOW_TO_PLAY_KNIGHT_TOUR}</p>
    </HeaderPopup>
  );
};
