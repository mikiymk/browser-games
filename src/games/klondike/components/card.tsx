import { Match, Switch } from "solid-js";
import type { JSXElement } from "solid-js";
import { CLUB, DIAMOND, HEART, SPADE } from "../constants";
import type { Rank, Suit } from "../constants";
import spade from "@/images/card/spade.svg";
import heart from "@/images/card/heart.svg";
import diamond from "@/images/card/diamond.svg";
import club from "@/images/card/club.svg";
import back from "@/images/card/back.svg";

export const DefineCards = (): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class="hidden">
      <title>define cards</title>

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
    </svg>
  );
};

type DefineCardProperties = {
  readonly suit: Suit;
  readonly rank: Rank;
};
const DefineCard = (properties: DefineCardProperties): JSXElement => {
  const suitImage = (): string => {
    const suitImages = {
      [CLUB]: club,
      [DIAMOND]: diamond,
      [HEART]: heart,
      [SPADE]: spade,
    };

    return `${suitImages[properties.suit].src}#root`;
  };

  const suitColor = (): string => {
    const suitColors = {
      [CLUB]: "black",
      [DIAMOND]: "red",
      [HEART]: "red",
      [SPADE]: "black",
    };
    return suitColors[properties.suit];
  };

  type UseSuitProperties = {
    readonly x: number;
    readonly y: number;
    readonly rotate?: boolean;
  };
  const UseSuit = (properties: UseSuitProperties): JSXElement => (
    <use
      href={suitImage()}
      x={properties.x - 15}
      y={properties.y - 15}
      height={30}
      width={30}
      transform={properties.rotate === true ? `rotate(180, ${properties.x}, ${properties.y})` : ""}
      fill={suitColor()}
    />
  );

  return (
    <symbol id={`${properties.suit}-${properties.rank}`} viewBox="0 0 100 156">
      <rect x={0} y={0} height={156} width={100} rx={10} ry={10} fill="#ddd" stroke="black" />

      <use href={suitImage()} x={4} y={10} height={16} width={16} fill={suitColor()} />
      <text x={12} y={35} font-size={"10"} text-anchor="middle" class="font-noto" fill={suitColor()}>
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
          <text x={50} y={88} text-anchor="middle" class="font-noto" fill={suitColor()} font-size="25">
            Jack
          </text>
        </Match>
        <Match when={properties.rank === 12}>
          <text x={50} y={88} text-anchor="middle" class="font-noto" fill={suitColor()} font-size="25">
            Queen
          </text>
        </Match>
        <Match when={properties.rank === 13}>
          <text x={50} y={88} text-anchor="middle" class="font-noto" fill={suitColor()} font-size="25">
            King
          </text>
        </Match>
      </Switch>
    </symbol>
  );
};

type CardProperties = {
  readonly suit: Suit;
  readonly rank: Rank;

  readonly x: number;
  readonly y: number;
};
export const Card = (properties: CardProperties): JSXElement => {
  return (
    <use href={`#${properties.suit}-${properties.rank}`} x={properties.x} y={properties.y} height={15.6} width={10} />
  );
};

type CardBackProperties = {
  readonly x: number;
  readonly y: number;
};
export const CardBack = (properties: CardBackProperties): JSXElement => {
  return <use href={`${back.src}#root`} x={properties.x} y={properties.y} height={15.6} width={10} />;
};
