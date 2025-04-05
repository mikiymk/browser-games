import { Close } from "@corvu/dialog";
import type { JSXElement } from "solid-js";
import { InformationPopUp } from "../../../components/page/information-popup.tsx";

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
