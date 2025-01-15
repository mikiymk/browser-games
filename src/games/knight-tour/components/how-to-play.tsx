import { HowToPlay } from "@/components/header-buttons/how-to-play";
import type { JSXElement } from "solid-js";

export const HowToPlayKnightTour = (): JSXElement => {
  return (
    <HowToPlay>
      <p>
        ナイトツアーは、8×8のチェス盤と1つのナイトの駒を使用するパズルです。
        プレイヤーはナイトを動かし、ボード上のすべてのマス目を正確に1回通ると勝ちとなります。
      </p>
    </HowToPlay>
  );
};
