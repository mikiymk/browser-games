import { HeaderButton } from "@/components/page-header/header-button";
import { PopUp } from "@/games/shogi/components/pop-up";
import type { JSXElement } from "solid-js";
import { createSignal } from "solid-js";

type HeaderPopupProperties = {
  readonly icon?: string | undefined;
  readonly label: string;
  readonly children: JSXElement;
};
export const HeaderPopup = (properties: HeaderPopupProperties): JSXElement => {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        <HeaderButton icon={properties.icon}>{properties.label}</HeaderButton>
      </button>
      <PopUp
        open={open()}
        outerClick={() => {
          setOpen(false);
        }}
      >
        {properties.children}
      </PopUp>
    </>
  );
};
