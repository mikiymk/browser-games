import { createSignal, For } from "solid-js";

import { Page } from "../../../common/components/page-frame/page.tsx";
import { backgammonBoard } from "../../../images/image-sources.ts";
import { stoneDark, stoneLight } from "../../../styles/colors.css.ts";

import type { JSXElement } from "solid-js";

const piecePositionX = (index: number): number => {
  const k = Math.min(index, 23 - index);
  return 130 - 10 * k + (k < 6 ? 6 : 0);
};

const piecePositionY = (indexX: number, indexY: number): number => {
  return indexX < 12 ? 91 - indexY * 8 : 9 + indexY * 8;
};

type PointsProperties = {
  readonly points: readonly number[];
};
const Points = (properties: PointsProperties): JSXElement => {
  // ポイントに駒を表示する
  return (
    <For each={properties.points}>
      {(point, indexX) => {
        // ポイントの駒の数だけ表示する
        return (
          <For each={Array.from({ length: Math.abs(point) })}>
            {(_, indexY) => (
              <circle
                cx={piecePositionX(indexX())}
                cy={piecePositionY(indexX(), indexY())}
                fill={point < 0 ? stoneLight : stoneDark}
                r={4}
                stroke="black"
                stroke-width={0.4}
              />
            )}
          </For>
        );
      }}
    </For>
  );
};

export const App = (): JSXElement => {
  // 各ポイントにある駒の数
  // サンプルで-4から4までの数字を入れる
  const [points, _setPoints] = createSignal(Array.from({ length: 24 }, (_, index) => (index % 13) - 6));
  // ゴールした駒の数
  const [goals, _setGoals] = createSignal<readonly [number, number]>([13, 4]);
  // バーにある駒の数
  const [bars, _setBars] = createSignal<readonly [number, number]>([5, 5]);

  return (
    <Page>
      <svg viewBox="0 0 156 100" xmlns="http://www.w3.org/2000/svg">
        <title>Game</title>

        {/* ゲームボード画像 */}
        <image height={100} href={backgammonBoard} width={156} />
        <Points points={points()} />

        {/* ゴールした駒の数 */}
        <text fill="black" font-size="8" text-anchor="middle" x={146} y={15}>
          {goals()[0]}
        </text>
        <text fill="white" font-size="8" text-anchor="middle" x={146} y={93}>
          {goals()[1]}
        </text>

        {/* ダブリングキューブ */}
        <rect fill="white" height={6} stroke="black" width={6} x={75} y={47} />

        {/* 除外された駒 */}
        <For each={Array.from({ length: bars()[0] })}>
          {(_, index) => {
            return (
              <circle
                class="a"
                cx={78}
                cy={43 - index() * 7}
                fill={stoneDark}
                r={2.5}
                stroke="black"
                stroke-width={0.4}
              />
            );
          }}
        </For>
        <For each={Array.from({ length: bars()[1] })}>
          {(_, index) => {
            return (
              <circle
                class="a"
                cx={78}
                cy={57 + index() * 7}
                fill={stoneLight}
                r={2.5}
                stroke="black"
                stroke-width={0.4}
              />
            );
          }}
        </For>

        <rect fill="#0000" height={100} tabindex={0} width={156} />
      </svg>
    </Page>
  );
};
