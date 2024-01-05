import stoneBlack from "@/images/reversi/stone-black.svg";
import stoneWhite from "@/images/reversi/stone-white.svg";
import {
  infoPlayButtonStyle,
  infoResultStyle,
  infoStoneCountStyle,
  infoStoneCurrentPlayerStyle,
  infoStoneStyle,
  infoStoneSymbolStyle,
  infoStyle,
  infoTimeBlackStyle,
  infoTimeStyle,
  infoTimeWhiteStyle,
  settingStartStyle,
} from "@/styles/reversi.css";
import type { JSXElement } from "solid-js";
import { Match, Show, Switch, createEffect, createMemo, createSignal } from "solid-js";
import { CellBlack, CellWhite } from "./const";

// ゲーム終了時に結果を表示する
const GameResult = (properties: { readonly black: number; readonly white: number }): JSXElement => {
  return (
    <div class={infoResultStyle}>
      <Switch fallback="Draw!">
        <Match when={properties.black < properties.white}>White Win!</Match>
        <Match when={properties.black > properties.white}>Black Win!</Match>
      </Switch>
    </div>
  );
};

type StoneProperties = {
  readonly playing: boolean;
  readonly black: number;
  readonly white: number;

  readonly color: number | undefined;
};
const StoneCount = (properties: StoneProperties): JSXElement => {
  const isBlack = (): boolean => properties.playing && properties.color === CellBlack;
  const isWhite = (): boolean => properties.playing && properties.color === CellWhite;

  return (
    <div class={infoStoneStyle}>
      <img
        classList={{
          [infoStoneSymbolStyle]: true,
          [infoStoneCurrentPlayerStyle]: isBlack(),
        }}
        src={stoneBlack.src}
        alt="black"
      />
      <span
        classList={{
          [infoStoneCountStyle]: true,
          [infoStoneCurrentPlayerStyle]: isBlack(),
        }}
      >
        {properties.black}
      </span>
      <span>-</span>
      <img
        classList={{
          [infoStoneSymbolStyle]: true,
          [infoStoneCurrentPlayerStyle]: isWhite(),
        }}
        src={stoneWhite.src}
        alt="white"
      />
      <span
        classList={{
          [infoStoneCountStyle]: true,
          [infoStoneCurrentPlayerStyle]: isWhite(),
        }}
      >
        {properties.white}
      </span>
    </div>
  );
};

const formatTime = (time: number): string => {
  const hour = Math.floor(time / 3_600_000)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor((time % 3_600_000) / 60_000)
    .toString()
    .padStart(2, "0");
  const second = Math.floor((time % 60_000) / 1000)
    .toString()
    .padStart(2, "0");

  return `${hour}:${minute}:${second}`;
};

type TimeProperties = {
  readonly playing: boolean;
  readonly color: number | undefined;
};

const Time = (properties: TimeProperties): JSXElement => {
  const [blackTime, setBlackTime] = createSignal(10 * 60 * 1000);
  const [whiteTime, setWhiteTime] = createSignal(10 * 60 * 1000);

  let previousTime = 0;
  const updateTime = (time: number): void => {
    if (properties.playing) {
      requestAnimationFrame(updateTime);
    }

    if (previousTime === 0) {
      previousTime = time;
    }

    const elapse = time - previousTime;

    if (properties.color === CellBlack) {
      setBlackTime((previousTime) => previousTime - elapse);
    } else if (properties.color === CellWhite) {
      setWhiteTime((previousTime) => previousTime - elapse);
    }

    previousTime = time;
  };

  createEffect(() => {
    if (properties.playing) {
      previousTime = 0;
      requestAnimationFrame(updateTime);
      setBlackTime(10 * 60 * 1000);
      setWhiteTime(10 * 60 * 1000);
    }
  });

  return (
    <div class={infoTimeStyle}>
      <span class={infoTimeBlackStyle}>{formatTime(blackTime())}</span>
      <span class={infoTimeWhiteStyle}>{formatTime(whiteTime())}</span>
    </div>
  );
};

type PlayButtonsProperties = {
  readonly start: () => void;
  readonly end: () => void;
};
const PlayButtons = (properties: PlayButtonsProperties): JSXElement => {
  return (
    <div class={infoPlayButtonStyle}>
      <button
        class={settingStartStyle}
        type="button"
        onClick={() => {
          properties.start();
        }}
      >
        Start Game
      </button>

      <button
        class={settingStartStyle}
        type="button"
        onClick={() => {
          properties.end();
        }}
      >
        End Game
      </button>
    </div>
  );
};

type InfoProperties = {
  readonly start: () => void;
  readonly end: () => void;
  readonly playing: boolean;

  readonly board: readonly number[];
  readonly color: number | undefined;

  readonly enable: boolean;
};
export const Info = (properties: InfoProperties): JSXElement => {
  const count = (color: number): number => {
    return properties.board.filter((square) => square === color).length;
  };
  const countBlack = createMemo(() => count(CellBlack));
  const countWhite = createMemo(() => count(CellWhite));

  return (
    <div class={infoStyle}>
      <Show when={!properties.playing && (countBlack() !== 0 || countWhite() !== 0)}>
        <GameResult black={countBlack()} white={countWhite()} />
      </Show>
      <StoneCount playing={properties.playing} black={countBlack()} white={countWhite()} color={properties.color} />

      <Show when={properties.enable}>
        <Time playing={properties.playing} color={properties.color} />
      </Show>

      <PlayButtons start={properties.start} end={properties.end} />
    </div>
  );
};
