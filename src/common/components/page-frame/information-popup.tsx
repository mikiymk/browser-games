import type { JSXElement } from "solid-js";

import { Content, Overlay, Portal, Root } from "@corvu/dialog";

import { content, overlay } from "./style.css.ts";

type InformationPopUpProperties = {
  readonly children: JSXElement;
  readonly open: boolean;
};

/** 条件を満たすと表示されるポップアップ */
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
