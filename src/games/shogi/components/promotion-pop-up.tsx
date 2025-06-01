import type { JSXElement } from "solid-js";

import { Close } from "@corvu/dialog";

import { InformationPopUp } from "../../../common/components/page-frame/information-popup.tsx";

type PromotionPopUpProperties = {
  readonly promotion: boolean;
  readonly resolve: (index: number) => void;
};
export const PromotionPopUp = (properties: PromotionPopUpProperties): JSXElement => {
  return (
    <InformationPopUp open={properties.promotion}>
      Promotion?
      <br />
      <Close
        onClick={() => {
          properties.resolve(1);
        }}
      >
        Yes
      </Close>
      <Close
        onClick={() => {
          properties.resolve(0);
        }}
      >
        No
      </Close>
    </InformationPopUp>
  );
};
