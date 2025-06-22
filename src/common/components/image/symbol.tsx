import { close, line, move, path } from "../../scripts/svg-path.ts";
import { CROSS_ID, FLAG, MARKER, MINE, NOUGHT_ID, STONE, STONE_KING } from "./id.ts";
import { stone, symbolFlagFill, symbolMark, symbolMineFill } from "./style.css.ts";

import type { JSXElement } from "solid-js";

/**
 * マル
 * @returns 要素
 */
export const Nought = (): JSXElement => {
  return (
    <symbol id={NOUGHT_ID} viewBox="0 0 60 60">
      <circle class={symbolMark} cx={30} cy={30} r={20} />
    </symbol>
  );
};

/**
 * バツ
 * @returns 要素
 */
export const Cross = (): JSXElement => {
  return (
    <symbol id={CROSS_ID} viewBox="0 0 60 60">
      <path class={symbolMark} d={path(move(15, 15), line(45, 45), move(15, 45), line(45, 15))} />
    </symbol>
  );
};

/**
 * 旗
 * @returns 要素
 */
export const Flag = (): JSXElement => {
  return (
    <symbol id={FLAG} viewBox="0 0 60 60">
      <path class={symbolMark} d={path(move(30, 5), line(30, 50), move(10, 50), line(50, 50))} />
      <path class={symbolFlagFill} d={path(move(30, 5), line(10, 30), line(30, 30), close())} />
    </symbol>
  );
};

/**
 * 爆弾
 * @returns 要素
 */
export const Mine = (): JSXElement => {
  return (
    <symbol id={MINE} viewBox="0 0 60 60">
      <path
        class={symbolMark}
        d={path(
          move(5, 30),
          line(55, 30),
          move(30, 5),
          line(30, 55),
          move(12, 12),
          line(48, 48),
          move(12, 48),
          line(48, 12),
        )}
      />

      <circle class={symbolMineFill} cx="30" cy="30" r="15" />
    </symbol>
  );
};

type StoneProperties = {
  readonly color: "black" | "white";
};
/**
 * オセロの石
 * @param properties - プロパティ
 * @returns 要素
 */
export const Stone = (properties: StoneProperties): JSXElement => {
  return (
    <symbol id={`${STONE}-${properties.color}`} viewBox="0 0 60 60">
      <circle class={stone[properties.color]} cx={30} cy={30} r={25} />
    </symbol>
  );
};

/**
 * オセロの石 (王)
 * @param properties - プロパティ
 * @returns 要素
 */
export const StoneKing = (properties: StoneProperties): JSXElement => {
  return (
    <symbol id={`${STONE_KING}-${properties.color}`} viewBox="0 0 60 60">
      <circle class={stone[properties.color]} cx={30} cy={30} r={25} />
      <circle class={stone[properties.color]} cx={30} cy={30} r={15} />
    </symbol>
  );
};

/**
 * マーカー
 * @returns 要素
 */
export const Marker = (): JSXElement => {
  return (
    <symbol id={MARKER} viewBox="0 0 60 60">
      <circle class={symbolMark} cx={30} cy={30} r={15} />
    </symbol>
  );
};
