import {
  blackStoneStyle,
  currentPlayerStyle,
  infoStoneSymbolStyle,
  infoStyle,
  whiteStoneStyle,
} from "@/games/reversi/style.css";
import stone from "@/images/reversi/stone.svg";
import type { JSXElement } from "solid-js";
import { createMemo } from "solid-js";
import { CellBlack, CellWhite } from "../const";
import { buttonStyle } from "@/styles/common.css";

// ゲーム終了時に結果を表示する

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
    <>
      <div class={isBlack() ? currentPlayerStyle : ""}>
        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class={infoStoneSymbolStyle}>
          <title>black</title>
          <use href={`${stone.src}#root`} class={blackStoneStyle} />
        </svg>

        {properties.black}
      </div>

      <div class={isWhite() ? currentPlayerStyle : ""}>
        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class={infoStoneSymbolStyle}>
          <title>white</title>
          <use href={`${stone.src}#root`} class={whiteStoneStyle} />
        </svg>

        {properties.white}
      </div>
    </>
  );
};

type PlayButtonsProperties = {
  readonly start: () => void;
  readonly end: () => void;
};
const PlayButtons = (properties: PlayButtonsProperties): JSXElement => {
  return (
    <div>
      <button
        class={buttonStyle}
        type="button"
        onClick={() => {
          properties.start();
        }}
      >
        Start Game
      </button>

      <button
        class={buttonStyle}
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
};
export const Info = (properties: InfoProperties): JSXElement => {
  const count = (color: number): number => {
    return properties.board.filter((square) => square === color).length;
  };
  const countBlack = createMemo(() => count(CellBlack));
  const countWhite = createMemo(() => count(CellWhite));

  return (
    <div class={infoStyle}>
      <StoneCount playing={properties.playing} black={countBlack()} white={countWhite()} color={properties.color} />
      <PlayButtons start={properties.start} end={properties.end} />
    </div>
  );
};
