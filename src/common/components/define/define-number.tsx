import { classes } from "../../scripts/classes.ts";
import { defineText } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type DefineNumberProperties = {
  /** カスタムクラス名 */
  readonly class?: string | undefined;
  /** 定義する数字 */
  readonly number: number;
};

/**
 * 数字のSVGシンボルを定義する
 * @param properties - プロパティ
 * @returns 要素
 */
export const DefineNumber = (properties: DefineNumberProperties): JSXElement => {
  return (
    <symbol id={String(properties.number)} viewBox="0 0 60 60">
      <text class={classes(defineText, properties.class)} x={30} y={54}>
        {properties.number}
      </text>
    </symbol>
  );
};
