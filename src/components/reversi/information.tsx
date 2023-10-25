import { Match, Show, Switch, createEffect, createMemo, createSignal } from "solid-js";

import stoneBlack from "@/images/reversi/stone-black.svg";
import stoneWhite from "@/images/reversi/stone-white.svg";
import {
  infoResultStyle,
  infoStoneCountStyle,
  infoStoneCurrentPlayerStyle,
  infoStoneStyle,
  infoStoneSymbolStyle,
  infoStyle,
  infoTimeBlackStyle,
  infoTimeStyle,
  infoTimeWhiteStyle,
} from "@/styles/reversi.css";

import { CellBlack, CellWhite } from "./const";

type InfoProperties = {
  playing: boolean;

  board: number[];
  color: number | undefined;

  enable: boolean;
};
export const Info = (properties: InfoProperties) => {
  return (
    <div class={infoStyle}>
      <GameResult playing={properties.playing} board={properties.board} />
      <StoneCount playing={properties.playing} board={properties.board} color={properties.color} />

      <Show when={properties.enable}>
        <Time playing={properties.playing} color={properties.color} />
      </Show>
    </div>
  );
};

const GameResult = (properties: { playing: boolean; board: number[] }) => {
  const count = (color: number) => {
    let count = 0;

    for (const square of properties.board) {
      if (square === color) {
        count += 1;
      }
    }

    return count;
  };
  const countBlack = createMemo(() => count(CellBlack));
  const countWhite = createMemo(() => count(CellWhite));

  return (
    <Show when={!properties.playing && (countBlack() !== 0 || countWhite() !== 0)}>
      {/* ゲーム終了時に結果を表示する */}

      <div class={infoResultStyle}>
        <Switch fallback="Draw!">
          <Match when={countBlack() < countWhite()}>White Win!</Match>
          <Match when={countBlack() > countWhite()}>Black Win!</Match>
        </Switch>
      </div>
    </Show>
  );
};

type StoneProperties = {
  playing: boolean;

  board: number[];
  color: number | undefined;
};
const StoneCount = (properties: StoneProperties) => {
  const count = (color: number) => {
    let count = 0;

    for (const square of properties.board) {
      if (square === color) {
        count += 1;
      }
    }

    return count;
  };
  const countBlack = createMemo(() => count(CellBlack));
  const countWhite = createMemo(() => count(CellWhite));

  return (
    <div class={infoStoneStyle}>
      <img
        classList={{
          [infoStoneSymbolStyle]: true,
          [infoStoneCurrentPlayerStyle]: properties.playing && properties.color === CellBlack,
        }}
        src={stoneBlack.src}
        alt="black"
      />
      <span
        classList={{
          [infoStoneCountStyle]: true,
          [infoStoneCurrentPlayerStyle]: properties.playing && properties.color === CellBlack,
        }}
      >
        {countBlack()}
      </span>
      <span>-</span>
      <img
        classList={{
          [infoStoneSymbolStyle]: true,
          [infoStoneCurrentPlayerStyle]: properties.playing && properties.color === CellWhite,
        }}
        src={stoneWhite.src}
        alt="white"
      />
      <span
        classList={{
          [infoStoneCountStyle]: true,
          [infoStoneCurrentPlayerStyle]: properties.playing && properties.color === CellWhite,
        }}
      >
        {countWhite()}
      </span>
    </div>
  );
};

type TimeProperties = {
  playing: boolean;
  color: number | undefined;
};
const Time = (properties: TimeProperties) => {
  const [blackTime, setBlackTime] = createSignal(10 * 60 * 1000);
  const [whiteTime, setWhiteTime] = createSignal(10 * 60 * 1000);

  let previousTime = 0;
  const updateTime = (time: number) => {
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

const formatTime = (time: number) => {
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
