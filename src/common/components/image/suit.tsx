import { arc, bezier, close, line, move, path } from "../../scripts/svg-path.ts";
import { CLUB, DIAMOND, HEART, SPADE } from "./id.ts";
import { suitBlack, suitRed } from "./style.css.ts";

import type { JSXElement } from "solid-js";

/**
 * スペード
 * @returns 要素
 */
export const SuitSpade = (): JSXElement => {
  return (
    <symbol id={SPADE} viewBox="0 0 60 60">
      <path
        class={suitBlack}
        d={path(
          move(15, 60),
          line(45, 60),
          line(33, 47),
          arc(12, 12, 0, 0, 0, 55, 25),
          line(30, 0),
          line(5, 25),
          arc(12, 12, 0, 0, 0, 27, 47),
          close(),
        )}
      />
    </symbol>
  );
};

/**
 * クラブ
 * @returns 要素
 */
export const SuitClub = (): JSXElement => {
  return (
    <symbol id={CLUB} viewBox="0 0 60 60">
      <path
        class={suitBlack}
        d={path(
          move(15, 60),
          line(45, 60),
          line(33, 47),
          arc(14, 14, 0, 1, 0, 40, 25),
          arc(14, 14, 0, 1, 0, 20, 25),
          arc(14, 14, 0, 1, 0, 27, 47),
          close(),
        )}
      />
    </symbol>
  );
};

/**
 * ダイヤ
 * @returns 要素
 */
export const SuitDiamond = (): JSXElement => {
  return (
    <symbol id={DIAMOND} viewBox="0 0 60 60">
      <path class={suitRed} d={path(move(30, 0), line(0, 30), line(30, 60), line(60, 30), close())} />
    </symbol>
  );
};

/**
 * ハート
 * @returns 要素
 */
export const SuitHeart = (): JSXElement => {
  return (
    <symbol id={HEART} viewBox="0 0 60 60">
      <path
        class={suitRed}
        d={path(
          move(30, 60),
          bezier(58, 30, 58, 30, 58, 20),
          arc(12, 12, 0, 0, 0, 30, 20),
          arc(12, 12, 0, 0, 0, 2, 20),
          bezier(2, 30, 2, 30, 30, 60),
          close(),
        )}
      />
    </symbol>
  );
};
