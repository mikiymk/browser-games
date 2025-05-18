import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import type { CardId, CourtRank, PipRank, Rank, SuitName } from "./id.ts";

import { cardBg, colorBlue } from "../../../styles/colors.css.ts";
import { SPADE } from "./id.ts";
import { cardBackGround, cardText, cardTextMiddle } from "./style.css.ts";
import { UseSuit } from "./suit.tsx";

type UseCardProperties = {
  readonly card: CardId;
  readonly height?: number | string | undefined;
  readonly width?: number | string | undefined;
  readonly x?: number | string | undefined;
  readonly y?: number | string | undefined;
};
export const UseCard = (properties: UseCardProperties): JSXElement => {
  return <use href={`#${properties.card}`} {...properties} />;
};

const selectIndexes = <T,>(array: readonly T[], indexes: readonly number[]): readonly T[] => {
  return indexes.map((index) => array[index] as T);
};

const basePipSuitPositions = [
  { x: 5, y: 14 },
  { x: 5, y: 30 },
  { x: 5, y: 47 },
  { x: 15, y: 14 },
  { x: 15, y: 30 },
  { x: 15, y: 47 },
  { x: 25, y: 14 },
  { x: 25, y: 30 },
  { x: 25, y: 47 },
];
const tSuitPositions = [
  { x: 5, y: 14 },
  { x: 5, y: 30 },
  { x: 5, y: 47 },
  { x: 15, y: 14 },
  { x: 15, y: 25 },
  { x: 15, y: 36 },
  { x: 15, y: 47 },
  { x: 25, y: 14 },
  { x: 25, y: 30 },
  { x: 25, y: 47 },
];

const suitPositions = {
  2: selectIndexes(basePipSuitPositions, [0, 8]),
  3: selectIndexes(basePipSuitPositions, [0, 4, 8]),
  4: selectIndexes(basePipSuitPositions, [0, 2, 6, 8]),
  5: selectIndexes(basePipSuitPositions, [0, 2, 4, 6, 8]),
  6: selectIndexes(basePipSuitPositions, [0, 1, 2, 6, 7, 8]),
  7: selectIndexes(basePipSuitPositions, [0, 1, 2, 4, 6, 7, 8]),
  8: selectIndexes(basePipSuitPositions, [0, 1, 2, 3, 5, 6, 7, 8]),
  9: basePipSuitPositions,
  a: selectIndexes(basePipSuitPositions, [4]),
  j: selectIndexes(basePipSuitPositions, [5]),
  k: selectIndexes(basePipSuitPositions, [2, 5, 8]),
  q: selectIndexes(basePipSuitPositions, [2, 8]),
  t: tSuitPositions,
} satisfies Record<Rank, readonly { x: number; y: number }[]>;

export const Shape = (): JSXElement => {
  return <rect class={cardBackGround} height="58" rx="5" ry="5" width="38" x="1" y="1" />;
};

type IndexProperties = {
  readonly rank: Rank;
  readonly suit: SuitName;
};
const Index = (properties: IndexProperties): JSXElement => {
  return (
    <>
      <Shape />
      <UseSuit height="8" suit={properties.suit} width="8" x="3" y="3" />
      <text class={cardText} x="12" y="11">
        {properties.rank}
      </text>
    </>
  );
};

/** スペードのエース */
export const SpadeAce = (): JSXElement => {
  return (
    <symbol id={"card-spade-a" satisfies CardId} viewBox="0 0 40 60">
      <Index rank="a" suit={SPADE} />
      <UseSuit height="30" suit={SPADE} width="30" x="5" y="20" />
    </symbol>
  );
};

type PipProperties = {
  readonly rank: PipRank;
  readonly suit: SuitName;
};
/** 数札 */
export const Pip = (properties: PipProperties): JSXElement => {
  return (
    <symbol id={`card-${properties.suit}-${properties.rank}` satisfies CardId} viewBox="0 0 40 60">
      <Index rank={properties.rank} suit={properties.suit} />
      <For each={suitPositions[properties.rank]}>
        {({ x, y }) => <UseSuit height="10" suit={properties.suit} width="10" x={x} y={y} />}
      </For>
    </symbol>
  );
};

type CourtProperties = {
  readonly rank: CourtRank;
  readonly suit: SuitName;
};
/** 数札 */
export const Court = (properties: CourtProperties): JSXElement => {
  const rankText = (): string => {
    return {
      j: "Jack",
      k: "King",
      q: "Queen",
    }[properties.rank];
  };

  return (
    <symbol id={`card-${properties.suit}-${properties.rank}` satisfies CardId} viewBox="0 0 40 60">
      <Index rank={properties.rank} suit={properties.suit} />
      <text class={cardTextMiddle} x="20" y="37">
        {rankText()}
      </text>
      <For each={suitPositions[properties.rank]}>
        {({ x, y }) => <UseSuit height="10" suit={properties.suit} width="10" x={x} y={y} />}
      </For>
    </symbol>
  );
};

/** 裏側 */
export const Back = (): JSXElement => {
  return (
    <symbol id={"card-back" satisfies CardId} viewBox="0 0 40 60">
      <Shape />
      <rect fill={colorBlue} height="50" width="30" x="5" y="5" />
      <circle cx="20" cy="30" fill={cardBg} r="5" />
    </symbol>
  );
};
