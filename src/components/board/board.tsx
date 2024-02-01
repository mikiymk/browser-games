import type { Accessor, JSXElement } from "solid-js";
import { For, Show } from "solid-js";
import { rectStyle } from "./style.css";

type BoardProperties<T> = {
  readonly height: number;
  readonly width: number;

  readonly data: readonly T[];

  readonly children: (square: T, index: Accessor<number>, x: Accessor<number>, y: Accessor<number>) => JSXElement;
  readonly class?: string;
  readonly background?: string;
  readonly click?: (square: T, index: number) => void;
};

export const Board = <T,>(properties: BoardProperties<T>): JSXElement => {
  return (
    <svg
      viewBox={`0 0 ${properties.width * 10} ${properties.height * 10}`}
      xmlns="http://www.w3.org/2000/svg"
      class={properties.class}
    >
      <title>board</title>

      <Show when={properties.background}>{(bg) => <use href={`${bg()}#root`} />}</Show>

      <For each={properties.data}>
        {(square, index) => {
          const x = (): number => (index() % properties.width) * 10;
          const y = (): number => Math.floor(index() / properties.width) * 10;

          return (
            <>
              {properties.children(square, index, x, y)}

              <Show when={properties.click}>
                {(click) => (
                  <rect
                    x={x()}
                    y={y()}
                    height={10}
                    width={10}
                    class={rectStyle}
                    tabindex={0}
                    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
                    onClick={() => {
                      click()(square, index());
                    }}
                    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
                    onKeyPress={() => {
                      click()(square, index());
                    }}
                  />
                )}
              </Show>
            </>
          );
        }}
      </For>
    </svg>
  );
};
