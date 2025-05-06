import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import type { CardId, CourtRank, PipRank, SuitName } from "./id.ts";

import { SPADE } from "./id.ts";
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

/** スペードのエース */
export const SpadeAce = (): JSXElement => {
  return (
    <symbol id={"card-spade-a" satisfies CardId} viewBox="0 0 40 60">
      <use href="#cf" />
      <UseSuit height="8" suit={SPADE} width="8" x="3" y="3" />
      <text class="t" x="12" y="11">
        A
      </text>
      <UseSuit height="30" suit={SPADE} width="30" x="5" y="20" />
    </symbol>
  );
};

const selectIndexes = <T,>(array: readonly T[], indexes: readonly number[]): readonly T[] =>
  indexes.map((index) => array[index] as T);
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

const pipSuitPositions = {
  2: selectIndexes(basePipSuitPositions, [0, 8]),
  3: selectIndexes(basePipSuitPositions, [0, 4, 8]),
  4: selectIndexes(basePipSuitPositions, [0, 2, 6, 8]),
  5: selectIndexes(basePipSuitPositions, [0, 2, 4, 6, 8]),
  6: selectIndexes(basePipSuitPositions, [0, 2, 3, 5, 6, 8]),
  7: selectIndexes(basePipSuitPositions, [0, 2, 3, 4, 5, 6, 8]),
  8: selectIndexes(basePipSuitPositions, [0, 1, 2, 3, 5, 6, 7, 8]),
  9: basePipSuitPositions,
  a: selectIndexes(basePipSuitPositions, [4]),
  t: tSuitPositions,
} satisfies Record<PipRank, readonly { x: number; y: number }[]>;

const courtSuitPositions = {
  j: selectIndexes(basePipSuitPositions, [5]),
  k: selectIndexes(basePipSuitPositions, [2, 5, 8]),
  q: selectIndexes(basePipSuitPositions, [2, 8]),
} satisfies Record<CourtRank, readonly { x: number; y: number }[]>;

type PipProperties = {
  readonly rank: PipRank;
  readonly suit: SuitName;
};
/** 数札 */
export const Pip = (properties: PipProperties): JSXElement => {
  return (
    <symbol id={`card-${properties.suit}-${properties.rank}` satisfies CardId} viewBox="0 0 40 60">
      <use href="#cf" />
      <UseSuit height="8" suit={properties.suit} width="8" x="3" y="3" />
      <text class="t" x="12" y="11">
        {properties.rank}
      </text>

      <For each={pipSuitPositions[properties.rank]}>
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
      <use href="#cf" />
      <UseSuit height="8" suit={properties.suit} width="8" x="3" y="3" />
      <text class="t" x="12" y="11">
        {properties.rank}
      </text>
      <text class="tm" x="20" y="37">
        {rankText()}
      </text>
      <For each={courtSuitPositions[properties.rank]}>
        {({ x, y }) => <UseSuit height="10" suit={properties.suit} width="10" x={x} y={y} />}
      </For>{" "}
    </symbol>
  );
};
