import { Button } from "@/components/button";
import type { JSXElement } from "solid-js";
import { PopUp } from "./pop-up";

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
