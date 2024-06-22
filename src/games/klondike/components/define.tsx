import back from "@/images/card/back.svg";
import club from "@/images/card/club.svg";
import diamond from "@/images/card/diamond.svg";
import empty from "@/images/card/empty.svg";
import heart from "@/images/card/heart.svg";
import spade from "@/images/card/spade.svg";
import { Match, Show, Switch } from "solid-js";
import type { JSXElement } from "solid-js";
import type { Card, Rank, Suit } from "../card";

export const DefineCards = (): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class="hidden">
      <title>define cards</title>

      <DefineSuits />

      <DefineCard suit="club" rank={1} />
      <DefineCard suit="club" rank={2} />
      <DefineCard suit="club" rank={3} />
      <DefineCard suit="club" rank={4} />
      <DefineCard suit="club" rank={5} />
      <DefineCard suit="club" rank={6} />
      <DefineCard suit="club" rank={7} />
      <DefineCard suit="club" rank={8} />
      <DefineCard suit="club" rank={9} />
      <DefineCard suit="club" rank={10} />
      <DefineCard suit="club" rank={11} />
      <DefineCard suit="club" rank={12} />
      <DefineCard suit="club" rank={13} />

      <DefineCard suit="diamond" rank={1} />
      <DefineCard suit="diamond" rank={2} />
      <DefineCard suit="diamond" rank={3} />
      <DefineCard suit="diamond" rank={4} />
      <DefineCard suit="diamond" rank={5} />
      <DefineCard suit="diamond" rank={6} />
      <DefineCard suit="diamond" rank={7} />
      <DefineCard suit="diamond" rank={8} />
      <DefineCard suit="diamond" rank={9} />
      <DefineCard suit="diamond" rank={10} />
      <DefineCard suit="diamond" rank={11} />
      <DefineCard suit="diamond" rank={12} />
      <DefineCard suit="diamond" rank={13} />

      <DefineCard suit="heart" rank={1} />
      <DefineCard suit="heart" rank={2} />
      <DefineCard suit="heart" rank={3} />
      <DefineCard suit="heart" rank={4} />
      <DefineCard suit="heart" rank={5} />
      <DefineCard suit="heart" rank={6} />
      <DefineCard suit="heart" rank={7} />
      <DefineCard suit="heart" rank={8} />
      <DefineCard suit="heart" rank={9} />
      <DefineCard suit="heart" rank={10} />
      <DefineCard suit="heart" rank={11} />
      <DefineCard suit="heart" rank={12} />
      <DefineCard suit="heart" rank={13} />

      <DefineCard suit="spade" rank={1} />
      <DefineCard suit="spade" rank={2} />
      <DefineCard suit="spade" rank={3} />
      <DefineCard suit="spade" rank={4} />
      <DefineCard suit="spade" rank={5} />
      <DefineCard suit="spade" rank={6} />
      <DefineCard suit="spade" rank={7} />
      <DefineCard suit="spade" rank={8} />
      <DefineCard suit="spade" rank={9} />
      <DefineCard suit="spade" rank={10} />
      <DefineCard suit="spade" rank={11} />
      <DefineCard suit="spade" rank={12} />
      <DefineCard suit="spade" rank={13} />

      <symbol id="back" viewBox="0 0 100 156">
        <use href={`${back.src}#root`} height={156} width={100} />
      </symbol>
      <symbol id="empty" viewBox="0 0 100 156">
        <use href={`${empty.src}#root`} height={156} width={100} />
      </symbol>
    </svg>
  );
};

const DefineSuits = (): JSXElement => {
  return (
    <>
      <symbol id="spade" viewBox="0 0 60 60">
        <use href={`${spade.src}#root`} class="fill-slate-900" />
      </symbol>
      <symbol id="spade-rev" viewBox="0 0 60 60">
        <use href={`${spade.src}#root`} class="fill-slate-900 rotate-180 translate-x-full translate-y-full" />
      </symbol>
      <symbol id="heart" viewBox="0 0 60 60">
        <use href={`${heart.src}#root`} class="fill-red-500" />
      </symbol>
      <symbol id="heart-rev" viewBox="0 0 60 60">
        <use href={`${heart.src}#root`} class="fill-red-500 rotate-180 translate-x-full translate-y-full" />
      </symbol>
      <symbol id="diamond" viewBox="0 0 60 60">
        <use href={`${diamond.src}#root`} class="fill-red-500" />
      </symbol>
      <symbol id="diamond-rev" viewBox="0 0 60 60">
        <use href={`${diamond.src}#root`} class="fill-red-500 rotate-180 translate-x-full translate-y-full" />
      </symbol>
      <symbol id="club" viewBox="0 0 60 60">
        <use href={`${club.src}#root`} class="fill-slate-900" />
      </symbol>
      <symbol id="club-rev" viewBox="0 0 60 60">
        <use href={`${club.src}#root`} class="fill-slate-900 rotate-180 translate-x-full translate-y-full" />
      </symbol>
    </>
  );
};

type DefineCardProperties = {
  readonly suit: Suit;
  readonly rank: Rank;
};
const DefineCard = (properties: DefineCardProperties): JSXElement => {
  const suitImage = (rotate: boolean): string => {
    return `#${properties.suit}${rotate ? "-rev" : ""}`;
  };

  const isRed = (): boolean => {
    return properties.suit === "heart" || properties.suit === "diamond";
  };

  type UseSuitProperties = {
    readonly x: number;
    readonly y: number;
    readonly rotate?: boolean;
  };
  const UseSuit = (properties: UseSuitProperties): JSXElement => (
    <use
      href={suitImage(properties.rotate === true)}
      x={properties.x - 15}
      y={properties.y - 15}
      height={30}
      width={30}
      class={isRed() ? "fill-red-500" : "fill-slate-900"}
    />
  );

  type UseTextProperties = {
    readonly children: string;
  };
  const UseText = (properties: UseTextProperties): JSXElement => {
    return (
      <text
        x={50}
        y={88}
        text-anchor="middle"
        class={`font-noto-jp font-[25px] ${isRed() ? "fill-red-500" : "fill-slate-900"}`}
      >
        {properties.children}
      </text>
    );
  };

  return (
    <symbol id={`${properties.suit}-${properties.rank}`} viewBox="0 0 100 156">
      <rect x={0} y={0} height={156} width={100} rx={10} ry={10} class="fill-slate-200 stroke-slate-900" />

      <use
        href={`#${properties.suit}`}
        x={4}
        y={7}
        height={16}
        width={16}
        class={isRed() ? "fill-red-500" : "fill-slate-900"}
      />
      <text x={22} y={20} class={`font-noto-jp font-[16px] ${isRed() ? "fill-red-500" : "fill-slate-900"}`}>
        {properties.rank}
      </text>

      <Switch>
        <Match when={properties.rank === 1}>
          <UseSuit x={50} y={78} />
        </Match>
        <Match when={properties.rank === 2}>
          <UseSuit x={50} y={33} />
          <UseSuit x={50} y={123} rotate />
        </Match>
        <Match when={properties.rank === 3}>
          <UseSuit x={50} y={33} />
          <UseSuit x={50} y={78} />
          <UseSuit x={50} y={123} rotate />
        </Match>
        <Match when={properties.rank === 4}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={30} y={123} rotate />
          <UseSuit x={70} y={123} rotate />
        </Match>
        <Match when={properties.rank === 5}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={50} y={78} />
          <UseSuit x={30} y={123} rotate />
          <UseSuit x={70} y={123} rotate />
        </Match>
        <Match when={properties.rank === 6}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={30} y={78} />
          <UseSuit x={70} y={78} />
          <UseSuit x={30} y={123} rotate />
          <UseSuit x={70} y={123} rotate />
        </Match>
        <Match when={properties.rank === 7}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={50} y={54} />
          <UseSuit x={30} y={78} />
          <UseSuit x={70} y={78} />
          <UseSuit x={30} y={123} rotate />
          <UseSuit x={70} y={123} rotate />
        </Match>
        <Match when={properties.rank === 8}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={50} y={54} />
          <UseSuit x={30} y={78} />
          <UseSuit x={70} y={78} />
          <UseSuit x={50} y={102} rotate />
          <UseSuit x={30} y={123} rotate />
          <UseSuit x={70} y={123} rotate />
        </Match>
        <Match when={properties.rank === 9}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={30} y={63} />
          <UseSuit x={70} y={63} />
          <UseSuit x={50} y={78} />
          <UseSuit x={30} y={93} rotate />
          <UseSuit x={70} y={93} rotate />
          <UseSuit x={30} y={123} rotate />
          <UseSuit x={70} y={123} rotate />
        </Match>
        <Match when={properties.rank === 10}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={50} y={48} />
          <UseSuit x={30} y={63} />
          <UseSuit x={70} y={63} />
          <UseSuit x={30} y={93} rotate />
          <UseSuit x={70} y={93} rotate />
          <UseSuit x={50} y={108} rotate />
          <UseSuit x={30} y={123} rotate />
          <UseSuit x={70} y={123} rotate />
        </Match>
        <Match when={properties.rank === 11}>
          <UseSuit x={50} y={123} />
          <UseText>Jack</UseText>
        </Match>
        <Match when={properties.rank === 12}>
          <UseSuit x={30} y={123} />
          <UseSuit x={70} y={123} />
          <UseText>Queen</UseText>
        </Match>
        <Match when={properties.rank === 13}>
          <UseSuit x={20} y={123} />
          <UseSuit x={50} y={123} />
          <UseSuit x={80} y={123} />
          <UseText>King</UseText>
        </Match>
      </Switch>
    </symbol>
  );
};

type UseCardProperties = {
  readonly card: Card | "back" | "empty";

  readonly x: number;
  readonly y: number;

  readonly handleClick?: () => void;
  readonly handleDoubleClick?: () => void;

  readonly selected?: boolean;
};
export const UseCard = (properties: UseCardProperties): JSXElement => {
  return (
    <>
      <use
        href={`#${properties.card}`}
        x={properties.x}
        y={properties.y}
        height={31.2}
        width={20}
        onClick={() => {
          return properties.handleClick?.();
        }}
        onKeyDown={() => {
          return properties.handleClick?.();
        }}
        onDblClick={() => {
          return properties.handleDoubleClick?.();
        }}
      />
      <Show when={properties.selected}>
        <rect
          x={properties.x}
          y={properties.y}
          height={31.2}
          width={20}
          rx={2}
          ry={2}
          class="fill-none stroke-slate-900"
        />
      </Show>
    </>
  );
};
