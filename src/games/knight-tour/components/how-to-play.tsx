import { HeaderPopup } from "@/components/page-header/header-popup";
import type { JSXElement } from "solid-js";

export const HowToPlay = (): JSXElement => {
  return (
    <HeaderPopup icon="question_mark" label="How to Play">
      <h2>How to Play</h2>

      <p>
        Knight's Tour is a puzzle using an 8 x 8 chess board and one knight piece. The player moves the knight and wins
        if he crosses every square on the board exactly once.
      </p>
    </HeaderPopup>
  );
};
