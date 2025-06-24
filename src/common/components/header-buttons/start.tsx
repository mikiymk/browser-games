import { TEXT_START } from "../../scripts/constants.ts";
import { HeaderButton } from "../page-frame/header-button.tsx";

import type { JSXElement } from "solid-js";

type StartButtonProperties = {
  readonly start: () => void;
};

/**
 * ゲームを開始するボタン
 * @param properties - プロパティ
 * @returns 要素
 */
export const Start = (properties: StartButtonProperties): JSXElement => {
  return (
    <button
      onClick={() => {
        properties.start();
      }}
      type="button"
    >
      <HeaderButton icon="play_arrow">{TEXT_START}</HeaderButton>
    </button>
  );
};
