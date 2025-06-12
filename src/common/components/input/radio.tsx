import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import { radio, radioInput } from "./style.css.ts";

type RadioProperties<T> = {
  /** 識別用の名前 */
  readonly name: string;
  /** 値を設定する関数 */
  readonly setValue: (value: T) => void;
  /** 現在の値 */
  readonly value: T;
  /** すべての選択肢のリスト */
  readonly values: readonly {
    /** 選択肢の表示ラベル */
    readonly label: string;
    /** 選択肢の値 */
    readonly value: T;
  }[];
};

/**
 * 選択ラジオボタン
 * @param properties - プロパティ
 * @returns 要素
 */
export const Radio = <T,>(properties: RadioProperties<T>): JSXElement => {
  return (
    <For each={properties.values}>
      {(value) => {
        return (
          <label class={radio}>
            <input
              checked={value.value === properties.value}
              class={radioInput}
              name={properties.name}
              onChange={() => {
                properties.setValue(value.value);
              }}
              type="radio"
            />

            {value.label}
          </label>
        );
      }}
    </For>
  );
};
