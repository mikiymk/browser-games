import { Content, Overlay, Portal, Root } from "@corvu/dialog";
import type { JSXElement } from "solid-js";
import { content, overlay } from "./style.css.ts";

type InformationPopUpProperties = {
  readonly open: boolean;
  readonly children: JSXElement;
};
export const InformationPopUp = (properties: InformationPopUpProperties): JSXElement => {
  return (
    <Root open={properties.open}>
      <Portal>
        <Overlay class={overlay} />
        <Content class={content}>{properties.children}</Content>
      </Portal>
    </Root>
  );
};
