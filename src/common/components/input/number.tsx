import { number } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type InputNumberProperties = {
  /** 識別用の名前 */
  readonly name: string;
  /** 値を設定する関数 */
  readonly setValue: (value: number) => void;
  /** 現在の値 */
  readonly value: number;
};

/**
 * 数値の入力
 * @param properties - プロパティ
 * @returns 要素
 */
export const InputNumber = (properties: InputNumberProperties): JSXElement => {
  return (
    <input
      class={number}
      name={properties.name}
      onChange={(event) => {
        properties.setValue(Number.parseInt(event.currentTarget.value));
      }}
      type="number"
      value={properties.value}
    />
  );
};
