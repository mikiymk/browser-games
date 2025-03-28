import type { JSXElement } from "solid-js";
import { Button } from "../../../components/elements/button.tsx";
import { PopUp } from "../../../components/pop-up/pop-up.tsx";

type PromotionPopUpProperties = {
  readonly promotion: boolean;
  readonly resolve: (index: number) => void;
};
export const PromotionPopUp = (properties: PromotionPopUpProperties): JSXElement => {
  return (
    <PopUp open={properties.promotion}>
      Promotion?
      <br />
      <Button
        onClick={() => {
          properties.resolve(1);
        }}
      >
        Yes
      </Button>
      <Button
        onClick={() => {
          properties.resolve(0);
        }}
      >
        No
      </Button>
    </PopUp>
  );
};
