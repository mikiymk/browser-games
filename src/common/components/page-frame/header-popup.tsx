import type { JSXElement } from "solid-js";

import { Content, Overlay, Root, Trigger } from "@corvu/dialog";
import { Portal } from "solid-js/web";

import { HeaderButton } from "./header-button.tsx";
import { content, overlay } from "./style.css.ts";

type HeaderPopupProperties = {
  readonly children: JSXElement;
  readonly icon?: string | undefined;
  readonly label: string;
};
export const HeaderPopup = (properties: HeaderPopupProperties): JSXElement => {
  return (
    <Root>
      <Trigger>
        <HeaderButton icon={properties.icon}>{properties.label}</HeaderButton>
      </Trigger>
      <Portal>
        <Overlay class={overlay} />
        <Content class={content}>{properties.children}</Content>
      </Portal>
    </Root>
  );
};
