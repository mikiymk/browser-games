import { Content, Overlay, Root, Trigger } from "@corvu/dialog";
import { Portal } from "solid-js/web";

import { HeaderButton } from "./header-button.tsx";
import { content, overlay } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type HeaderPopupProperties = {
  readonly children: JSXElement;
  readonly icon?: string | undefined;
  readonly label: string;
};

/**
 * 上部のボタンを押すと表示されるポップアップ
 * @param properties - プロパティ
 * @returns 要素
 */
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
