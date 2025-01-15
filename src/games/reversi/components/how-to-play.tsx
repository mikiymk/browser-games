import { HowToPlay } from "@/components/header-buttons/how-to-play";
import type { JSXElement } from "solid-js";

export const HowToPlayReversi = (): JSXElement => {
  return (
    <HowToPlay>
      <ul>
        <li>8×8ボード。</li>
        <li>石は64個。片面は暗く塗装され、もう片面は明るく塗装されます。</li>
      </ul>

      <p>闇と光の 2 人のプレイヤーが対戦します。</p>
      <p>闇と光が交互に石を 1 つずつ配置し、最後により多くの石を獲得することを目指します。</p>
      <p>
        自分の石を1つボード上の正方形に置きます。
        すでに盤上にある自分の石と、今置いた石の間に縦・横・斜めに挟まれた相手の石を裏返し、自分の石とします。
      </p>
      <p>挟めない場所に石を置くことはできません。</p>
      <p>置ける場所がない場合は石を置かずに相手のターンになります。 (パス)</p>
      <p>
        どちらのプレイヤーも石を置けない場合、ゲームは終了します。
        盤上の石の数を数え、最も多くの石を持っていたプレイヤーが勝ちとなります。
      </p>
    </HowToPlay>
  );
};
