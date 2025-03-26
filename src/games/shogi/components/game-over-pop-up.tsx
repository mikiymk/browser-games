import type { JSXElement } from "solid-js";
import { Button } from "../../../components/elements/button.ts";
import { PopUp } from "../../../components/pop-up/pop-up.ts";

type GameOverPopUpProperties = {
  readonly gameOver: boolean;
  readonly set: (gameOver: number) => void;
};
export const GameOverPopUp = (properties: GameOverPopUpProperties): JSXElement => {
  return (
    <PopUp open={properties.gameOver}>
      Game End
      <br />
      <Button
        onClick={() => {
          properties.set(0);
        }}
      >
        Close
      </Button>
    </PopUp>
  );
};
