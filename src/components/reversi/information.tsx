import { Match, Show, Switch, createEffect, createMemo, createSignal } from "solid-js";

import stoneBlack from "@/images/reversi/stone-black.svg";
import stoneWhite from "@/images/reversi/stone-white.svg";

import { CellBlack, CellWhite } from "./const";

type InfoProperties = {
  playing: boolean;

  board: number[];
  color: number | undefined;

  enable: boolean;
};
export const Info = (properties: InfoProperties) => {
  return (
    <div>
      <StoneCount playing={properties.playing} board={properties.board} color={properties.color} />
      <Time playing={properties.playing} color={properties.color} enable={properties.enable} />
    </div>
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
    <div>
      <Switch>
        <Match when={properties.playing && properties.color === CellBlack}>Black</Match>
        <Match when={properties.playing && properties.color === CellWhite}>White</Match>
        <Match when={!properties.playing && (countBlack() !== 0 || countWhite() !== 0)}>
          {/* ゲーム終了時に結果を表示する */}
          <Switch fallback="Draw!">
            <Match when={countBlack() < countWhite()}>White Win!</Match>
            <Match when={countBlack() > countWhite()}>Black Win!</Match>
          </Switch>
        </Match>
      </Switch>

      <img src={stoneBlack.src} alt="black" height="20" />
      {countBlack()} - {countWhite()}
      <img src={stoneWhite.src} alt="white" height="20" />
    </div>
  );
};

type TimeProperties = {
  playing: boolean;
  color: number | undefined;
  enable: boolean;
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
    if (properties.playing && properties.enable) {
      previousTime = 0;
      requestAnimationFrame(updateTime);
      setBlackTime(10 * 60 * 1000);
      setWhiteTime(10 * 60 * 1000);
    }
  });

  return (
    <div>
      <Show when={properties.enable}>
        <div>
          Watch
          <img src={stoneBlack.src} alt="black" height="20" />
          {formatTime(blackTime())}

          <img src={stoneWhite.src} alt="white" height="20" />
          {formatTime(whiteTime())}
        </div>
      </Show>
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
