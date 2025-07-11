import { TEXT_HOW_TO_PLAY } from "../../scripts/constants.ts";
import { HeaderPopup } from "../page-frame/header-popup.tsx";

import type { JSXElement } from "solid-js";

type HowToPlayProperties = {
  readonly children: JSXElement;
};
/**
 * 遊びかたを表示する
 * @param properties - プロパティ
 * @returns 要素
 */
export const HowToPlay = (properties: HowToPlayProperties): JSXElement => {
  return (
    <HeaderPopup icon="help" label={TEXT_HOW_TO_PLAY}>
      <h2>{TEXT_HOW_TO_PLAY}</h2>

      {properties.children}
    </HeaderPopup>
  );
};
