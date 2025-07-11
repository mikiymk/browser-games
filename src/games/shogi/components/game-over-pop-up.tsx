import { Close } from "@corvu/dialog";

import { InformationPopUp } from "../../../common/components/page-frame/information-popup.tsx";

import type { JSXElement } from "solid-js";

type GameOverPopUpProperties = {
  readonly gameOver: boolean;
  readonly set: (gameOver: number) => void;
};
export const GameOverPopUp = (properties: GameOverPopUpProperties): JSXElement => {
  return (
    <InformationPopUp open={properties.gameOver}>
      Game End
      <Close
        onClick={() => {
          properties.set(0);
        }}
      >
        close
      </Close>
    </InformationPopUp>
  );
};
