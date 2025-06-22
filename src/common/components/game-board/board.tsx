import { For, Show } from "solid-js";

import { clear } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type BoardProperties<T> = {
  /** ゲームボードの背景画像 */
  readonly background?: string;
  readonly children: (square: T, index: number, x: number, y: number) => JSXElement;

  readonly class?: string;

  readonly data: readonly T[];
  /** ゲームボードの高さ */
  readonly height: number;
  /** ゲームボードをクリックした時のイベント */
  readonly onClick?: (square: T, index: number, event: MouseEvent) => void;
  /** ゲームボードを右クリックした時のイベント */
  readonly onContextmenu?: (square: T, index: number, event: MouseEvent) => void;
  /** ゲームボードの幅 */
  readonly width: number;
};

/**
 * ゲームボードを描画する。
 * @param properties - プロパティ
 * @returns 要素
 */
export const Board = <T,>(properties: BoardProperties<T>): JSXElement => {
  const handleClick = (event: MouseEvent & { readonly currentTarget: Element }): [square: T, index: number] => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * properties.width);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * properties.height);
    const index = y * properties.width + x;
    const square = properties.data[index] as T;

    return [square, index];
  };

  return (
    <svg
      class={properties.class}
      viewBox={`0 0 ${properties.width * 10} ${properties.height * 10}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>board</title>

      <Show when={properties.background}>
        {(bg) => <image height={properties.height * 10} href={bg()} width={properties.width * 10} />}
      </Show>

      <For each={properties.data}>
        {(square, index) => {
          const x = (): number => (index() % properties.width) * 10;
          const y = (): number => Math.floor(index() / properties.width) * 10;

          return <>{properties.children(square, index(), x(), y())}</>;
        }}
      </For>

      <Show when={properties.onClick !== undefined || properties.onContextmenu !== undefined}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: キーボードでできない */}
        <rect
          class={clear}
          height={properties.height * 10}
          onClick={(event) => {
            const [square, index] = handleClick(event);

            properties.onClick?.(square, index, event);
          }}
          onContextMenu={(event) => {
            const [square, index] = handleClick(event);

            properties.onContextmenu?.(square, index, event);
          }}
          tabindex={0}
          width={properties.width * 10}
        />
      </Show>
    </svg>
  );
};
