import type { JSXElement } from "solid-js";
import { PopUp } from "./pop-up";
import { Button } from "@/components/button";

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
