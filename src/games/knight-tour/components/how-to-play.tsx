import { HeaderPopup } from "@/components/page-header/header-popup";
import { TEXT_HOW_TO_PLAY } from "@/scripts/constants";
import type { JSXElement } from "solid-js";

export const HowToPlay = (): JSXElement => {
  return (
    <HeaderPopup icon="help" label={TEXT_HOW_TO_PLAY}>
      <h2>{TEXT_HOW_TO_PLAY}</h2>

      <p>
        ナイトツアーは、8×8のチェス盤と1つのナイトの駒を使用するパズルです。
        プレイヤーはナイトを動かし、ボード上のすべてのマス目を正確に1回通ると勝ちとなります。
      </p>
    </HeaderPopup>
  );
};
