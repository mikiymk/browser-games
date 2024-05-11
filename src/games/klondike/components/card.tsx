import { Match, Switch } from "solid-js";
import type { JSXElement } from "solid-js";
import { CLUB, DIAMOND, HEART, SPADE } from "../constants";
import type { Rank, Suit } from "../constants";
import spade from "@/images/card/spade.svg";
import heart from "@/images/card/heart.svg";
import diamond from "@/images/card/diamond.svg";
import club from "@/images/card/club.svg";
import type { ImageMetadata } from "astro";

type CardProperties = {
  readonly suit: Suit;
  readonly rank: Rank;

  readonly x: number;
  readonly y: number;
};
export const Card = (properties: CardProperties): JSXElement => {
  const suitImage = (): ImageMetadata =>
    ({
      [CLUB]: club,
      [DIAMOND]: diamond,
      [HEART]: heart,
      [SPADE]: spade,
    })[properties.suit];

  const suitColor = (): string =>
    ({
      [CLUB]: "black",
      [DIAMOND]: "red",
      [HEART]: "red",
      [SPADE]: "black",
    })[properties.suit];

  const rankText = (): string =>
    (
      ({
        1: "A",
        11: "J",
        12: "Q",
        13: "K",
      }) as Partial<Record<Rank, string>>
    )[properties.rank] ?? String(properties.rank);

  const relativeX = (x: number): number => x + properties.x;
  const relativeY = (y: number): number => y + properties.y;

  const rotate = (): string => `rotate(180, ${relativeX(5)}, ${relativeY(7.8)})`;

  type UseSuitProperties = {
    readonly x: number;
    readonly y: number;
    readonly rotate?: boolean;
  };
  const UseSuit = (properties: UseSuitProperties): JSXElement => (
    <use
      href={`${suitImage().src}#root`}
      x={relativeX(properties.x) - 1.5}
      y={relativeY(properties.y) - 1.5}
      height={3}
      width={3}
      transform={properties.rotate === true ? rotate() : ""}
      fill={suitColor()}
    />
  );

  return (
    <>
      <rect
        x={relativeX(0)}
        y={relativeY(0)}
        height={15.6}
        width={10}
        rx={1}
        ry={1}
        fill="#ddd"
        stroke="black"
        stroke-width={0.1}
      />

      <use
        href={`${suitImage().src}#root`}
        x={relativeX(0.5)}
        y={relativeY(0.5)}
        height={2}
        width={2}
        fill={suitColor()}
      />
      <text
        x={relativeX(1.5)}
        y={relativeY(4)}
        font-size={"1.5"}
        text-anchor="middle"
        class="font-noto"
        fill={suitColor()}
      >
        {rankText()}
      </text>

      <Switch>
        <Match when={properties.rank === 1}>
          <UseSuit x={5} y={7.8} />
        </Match>
        <Match when={properties.rank === 2}>
          <UseSuit x={5} y={3} />
          <UseSuit x={5} y={3} rotate />
        </Match>
        <Match when={properties.rank === 3}>
          <UseSuit x={5} y={3} />
          <UseSuit x={5} y={7.8} />
          <UseSuit x={5} y={3} rotate />
        </Match>
        <Match when={properties.rank === 4}>
          <UseSuit x={3} y={3} />
          <UseSuit x={7} y={3} />
          <UseSuit x={3} y={3} rotate />
          <UseSuit x={7} y={3} rotate />
        </Match>
        <Match when={properties.rank === 5}>
          <UseSuit x={3} y={3} />
          <UseSuit x={7} y={3} />
          <UseSuit x={5} y={7.8} />
          <UseSuit x={3} y={3} rotate />
          <UseSuit x={7} y={3} rotate />
        </Match>
        <Match when={properties.rank === 6}>
          <UseSuit x={3} y={3} />
          <UseSuit x={7} y={3} />
          <UseSuit x={3} y={7.8} />
          <UseSuit x={7} y={7.8} />
          <UseSuit x={3} y={3} rotate />
          <UseSuit x={7} y={3} rotate />
        </Match>
        <Match when={properties.rank === 7}>
          <UseSuit x={3} y={3} />
          <UseSuit x={7} y={3} />
          <UseSuit x={5} y={5.4} />
          <UseSuit x={3} y={7.8} />
          <UseSuit x={7} y={7.8} />
          <UseSuit x={3} y={3} rotate />
          <UseSuit x={7} y={3} rotate />
        </Match>
        <Match when={properties.rank === 8}>
          <UseSuit x={3} y={3} />
          <UseSuit x={7} y={3} />
          <UseSuit x={5} y={5.4} />
          <UseSuit x={3} y={7.8} />
          <UseSuit x={7} y={7.8} />
          <UseSuit x={5} y={5.4} rotate />
          <UseSuit x={3} y={3} rotate />
          <UseSuit x={7} y={3} rotate />
        </Match>
        <Match when={properties.rank === 9}>
          <UseSuit x={3} y={3} />
          <UseSuit x={7} y={3} />
          <UseSuit x={3} y={6} />
          <UseSuit x={7} y={6} />
          <UseSuit x={5} y={7.8} />
          <UseSuit x={3} y={6} rotate />
          <UseSuit x={7} y={6} rotate />
          <UseSuit x={3} y={3} rotate />
          <UseSuit x={7} y={3} rotate />
        </Match>
        <Match when={properties.rank === 10}>
          <UseSuit x={3} y={3} />
          <UseSuit x={7} y={3} />
          <UseSuit x={5} y={4.5} />
          <UseSuit x={3} y={6} />
          <UseSuit x={7} y={6} />
          <UseSuit x={3} y={6} rotate />
          <UseSuit x={7} y={6} rotate />
          <UseSuit x={5} y={4.5} rotate />
          <UseSuit x={3} y={3} rotate />
          <UseSuit x={7} y={3} rotate />
        </Match>
        <Match when={properties.rank === 11}>
          <text
            x={relativeX(5)}
            y={relativeY(8.8)}
            text-anchor="middle"
            class="font-noto"
            fill={suitColor()}
            font-size="3"
          >
            Jack
          </text>
        </Match>
        <Match when={properties.rank === 12}>
          <text
            x={relativeX(5)}
            y={relativeY(8.8)}
            text-anchor="middle"
            class="font-noto"
            fill={suitColor()}
            font-size="3"
          >
            Queen
          </text>
        </Match>
        <Match when={properties.rank === 13}>
          <text
            x={relativeX(5)}
            y={relativeY(8.8)}
            text-anchor="middle"
            class="font-noto"
            fill={suitColor()}
            font-size="3"
          >
            King
          </text>
        </Match>
      </Switch>

      <path
        d={`
        M ${relativeX(0)} ${relativeY(0)}
        L ${relativeX(10)} ${relativeY(0)}

        M ${relativeX(0)} ${relativeY(7.8)}
        L ${relativeX(10)} ${relativeY(7.8)}

        M ${relativeX(0)} ${relativeY(15.6)}
        L ${relativeX(10)} ${relativeY(15.6)}

        M ${relativeX(0)} ${relativeY(0)}
        L ${relativeX(0)} ${relativeY(15.6)}

        M ${relativeX(5)} ${relativeY(0)}
        L ${relativeX(5)} ${relativeY(15.6)}
        
        M ${relativeX(10)} ${relativeY(0)}
        L ${relativeX(10)} ${relativeY(15.6)}
      `}
        stroke="red"
        stroke-width={0.1}
      />
    </>
  );
};
