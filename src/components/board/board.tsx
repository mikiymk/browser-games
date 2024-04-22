import type { Accessor, JSXElement } from "solid-js";
import { For, Show } from "solid-js";

type BoardProperties<T> = {
  readonly height: number;
  readonly width: number;

  readonly data: readonly T[];

  readonly children: (square: T, index: Accessor<number>, x: Accessor<number>, y: Accessor<number>) => JSXElement;
  readonly class?: string;
  readonly background?: string;
  readonly click?: (square: T, index: number) => void;
  readonly contextmenu?: (square: T, index: number) => void;
};

export const Board = <T,>(properties: BoardProperties<T>): JSXElement => {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- 謎のエラー
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
      viewBox={`0 0 ${properties.width * 10} ${properties.height * 10}`}
      xmlns="http://www.w3.org/2000/svg"
      class={properties.class}
    >
      <title>board</title>

      <Show when={properties.background}>
        {(bg) => <image href={bg()} height={properties.height * 10} width={properties.width * 10} />}
      </Show>

      <For each={properties.data}>
        {(square, index) => {
          const x = (): number => (index() % properties.width) * 10;
          const y = (): number => Math.floor(index() / properties.width) * 10;

          return properties.children(square, index, x, y);
        }}
      </For>

      <Show when={properties.click !== undefined || properties.contextmenu !== undefined}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: キーボードでできない */}
        <rect
          height={properties.height * 10}
          width={properties.width * 10}
          class="opacity-0"
          tabindex={0}
          onClick={(event) => {
            const [square, index] = handleClick(event);

            properties.click?.(square, index);
            properties.contextmenu?.(square, index);
          }}
        />
      </Show>
    </svg>
  );
};
