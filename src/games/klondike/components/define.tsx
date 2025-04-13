import type { JSXElement } from "solid-js";

import { Match, Show, Switch } from "solid-js";

import type { Card, Rank, Suit } from "../card.ts";

import { DefineUse } from "../../../components/define/define-use.tsx";
import { Define } from "../../../components/define/define.tsx";
import back from "../../../images/card/back.svg";
import club from "../../../images/card/club.svg";
import diamond from "../../../images/card/diamond.svg";
import empty from "../../../images/card/empty.svg";
import heart from "../../../images/card/heart.svg";
import spade from "../../../images/card/spade.svg";
import { card, rankColor, reversed, selected, suitColor, textColor } from "./style.css.ts";

export const DefineCards = (): JSXElement => {
  return (
    <Define>
      <DefineSuits />

      <DefineCard rank={1} suit="club" />
      <DefineCard rank={2} suit="club" />
      <DefineCard rank={3} suit="club" />
      <DefineCard rank={4} suit="club" />
      <DefineCard rank={5} suit="club" />
      <DefineCard rank={6} suit="club" />
      <DefineCard rank={7} suit="club" />
      <DefineCard rank={8} suit="club" />
      <DefineCard rank={9} suit="club" />
      <DefineCard rank={10} suit="club" />
      <DefineCard rank={11} suit="club" />
      <DefineCard rank={12} suit="club" />
      <DefineCard rank={13} suit="club" />

      <DefineCard rank={1} suit="diamond" />
      <DefineCard rank={2} suit="diamond" />
      <DefineCard rank={3} suit="diamond" />
      <DefineCard rank={4} suit="diamond" />
      <DefineCard rank={5} suit="diamond" />
      <DefineCard rank={6} suit="diamond" />
      <DefineCard rank={7} suit="diamond" />
      <DefineCard rank={8} suit="diamond" />
      <DefineCard rank={9} suit="diamond" />
      <DefineCard rank={10} suit="diamond" />
      <DefineCard rank={11} suit="diamond" />
      <DefineCard rank={12} suit="diamond" />
      <DefineCard rank={13} suit="diamond" />

      <DefineCard rank={1} suit="heart" />
      <DefineCard rank={2} suit="heart" />
      <DefineCard rank={3} suit="heart" />
      <DefineCard rank={4} suit="heart" />
      <DefineCard rank={5} suit="heart" />
      <DefineCard rank={6} suit="heart" />
      <DefineCard rank={7} suit="heart" />
      <DefineCard rank={8} suit="heart" />
      <DefineCard rank={9} suit="heart" />
      <DefineCard rank={10} suit="heart" />
      <DefineCard rank={11} suit="heart" />
      <DefineCard rank={12} suit="heart" />
      <DefineCard rank={13} suit="heart" />

      <DefineCard rank={1} suit="spade" />
      <DefineCard rank={2} suit="spade" />
      <DefineCard rank={3} suit="spade" />
      <DefineCard rank={4} suit="spade" />
      <DefineCard rank={5} suit="spade" />
      <DefineCard rank={6} suit="spade" />
      <DefineCard rank={7} suit="spade" />
      <DefineCard rank={8} suit="spade" />
      <DefineCard rank={9} suit="spade" />
      <DefineCard rank={10} suit="spade" />
      <DefineCard rank={11} suit="spade" />
      <DefineCard rank={12} suit="spade" />
      <DefineCard rank={13} suit="spade" />

      <symbol id="back" viewBox="0 0 100 156">
        <use height={156} href={`${back.src}#root`} width={100} />
      </symbol>
      <symbol id="empty" viewBox="0 0 100 156">
        <use height={156} href={`${empty.src}#root`} width={100} />
      </symbol>
    </Define>
  );
};

const DefineSuits = (): JSXElement => {
  return (
    <>
      <DefineUse href={spade.src} id="spade" />
      <DefineUse href={club.src} id="club" />
      <DefineUse href={heart.src} id="heart" />
      <DefineUse href={diamond.src} id="diamond" />

      <DefineUse class={reversed} href={spade.src} id="spade-rev" />
      <DefineUse class={reversed} href={club.src} id="club-rev" />
      <DefineUse class={reversed} href={heart.src} id="heart-rev" />
      <DefineUse class={reversed} href={diamond.src} id="diamond-rev" />
    </>
  );
};

type DefineCardProperties = {
  readonly rank: Rank;
  readonly suit: Suit;
};
const DefineCard = (properties: DefineCardProperties): JSXElement => {
  const suitImage = (rotate: boolean): string => {
    return `#${properties.suit}${rotate ? "-rev" : ""}`;
  };

  type UseSuitProperties = {
    readonly rotate?: boolean;
    readonly x: number;
    readonly y: number;
  };
  const UseSuit = (suitProperties: UseSuitProperties): JSXElement => (
    <use
      class={suitColor[properties.suit]}
      height={30}
      href={suitImage(suitProperties.rotate === true)}
      width={30}
      x={suitProperties.x - 15}
      y={suitProperties.y - 15}
    />
  );

  type UseTextProperties = {
    readonly children: string;
  };
  const UseText = (textProperties: UseTextProperties): JSXElement => {
    return (
      <text class={textColor[properties.suit]} text-anchor="middle" x={50} y={88}>
        {textProperties.children}
      </text>
    );
  };

  return (
    <symbol id={`${properties.suit}-${properties.rank}`} viewBox="0 0 100 156">
      <rect class={card} height={156} rx={10} ry={10} width={100} x={0} y={0} />

      <use class={suitColor[properties.suit]} height={16} href={`#${properties.suit}`} width={16} x={4} y={7} />
      <text class={rankColor[properties.suit]} x={22} y={20}>
        {properties.rank}
      </text>

      <Switch>
        <Match when={properties.rank === 1}>
          <UseSuit x={50} y={78} />
        </Match>
        <Match when={properties.rank === 2}>
          <UseSuit x={50} y={33} />
          <UseSuit rotate x={50} y={123} />
        </Match>
        <Match when={properties.rank === 3}>
          <UseSuit x={50} y={33} />
          <UseSuit x={50} y={78} />
          <UseSuit rotate x={50} y={123} />
        </Match>
        <Match when={properties.rank === 4}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit rotate x={30} y={123} />
          <UseSuit rotate x={70} y={123} />
        </Match>
        <Match when={properties.rank === 5}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={50} y={78} />
          <UseSuit rotate x={30} y={123} />
          <UseSuit rotate x={70} y={123} />
        </Match>
        <Match when={properties.rank === 6}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={30} y={78} />
          <UseSuit x={70} y={78} />
          <UseSuit rotate x={30} y={123} />
          <UseSuit rotate x={70} y={123} />
        </Match>
        <Match when={properties.rank === 7}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={50} y={54} />
          <UseSuit x={30} y={78} />
          <UseSuit x={70} y={78} />
          <UseSuit rotate x={30} y={123} />
          <UseSuit rotate x={70} y={123} />
        </Match>
        <Match when={properties.rank === 8}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={50} y={54} />
          <UseSuit x={30} y={78} />
          <UseSuit x={70} y={78} />
          <UseSuit rotate x={50} y={102} />
          <UseSuit rotate x={30} y={123} />
          <UseSuit rotate x={70} y={123} />
        </Match>
        <Match when={properties.rank === 9}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={30} y={63} />
          <UseSuit x={70} y={63} />
          <UseSuit x={50} y={78} />
          <UseSuit rotate x={30} y={93} />
          <UseSuit rotate x={70} y={93} />
          <UseSuit rotate x={30} y={123} />
          <UseSuit rotate x={70} y={123} />
        </Match>
        <Match when={properties.rank === 10}>
          <UseSuit x={30} y={33} />
          <UseSuit x={70} y={33} />
          <UseSuit x={50} y={48} />
          <UseSuit x={30} y={63} />
          <UseSuit x={70} y={63} />
          <UseSuit rotate x={30} y={93} />
          <UseSuit rotate x={70} y={93} />
          <UseSuit rotate x={50} y={108} />
          <UseSuit rotate x={30} y={123} />
          <UseSuit rotate x={70} y={123} />
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
  readonly card: "back" | "empty" | Card;

  readonly handleClick?: () => void;
  readonly handleDoubleClick?: () => void;

  readonly selected?: boolean;
  readonly x: number;

  readonly y: number;
};
export const UseCard = (properties: UseCardProperties): JSXElement => {
  return (
    <>
      <use
        height={31.2}
        href={`#${properties.card}`}
        onClick={() => {
          return properties.handleClick?.();
        }}
        onDblClick={() => {
          return properties.handleDoubleClick?.();
        }}
        onKeyDown={() => {
          return properties.handleClick?.();
        }}
        width={20}
        x={properties.x}
        y={properties.y}
      />
      <Show when={properties.selected}>
        <rect class={selected} height={31.2} rx={2} ry={2} width={20} x={properties.x} y={properties.y} />
      </Show>
    </>
  );
};
