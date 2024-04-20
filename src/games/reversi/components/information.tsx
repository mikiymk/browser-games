import { Button } from "@/components/button";
import { StyledSvg } from "@/components/styled-svg";
import stone from "@/images/reversi/stone.svg";
import type { JSXElement } from "solid-js";
import { createMemo } from "solid-js";
import { CellBlack, CellWhite } from "../const";

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
      <div class={isBlack() ? "bg-lime-400" : ""}>
        <StyledSvg src={stone.src} alt="black" class="fill-stone-500 stroke-slate-900" />

        {properties.black}
      </div>

      <div class={isWhite() ? "bg-lime-400" : ""}>
        <StyledSvg src={stone.src} alt="black" class="fill-stone-200 stroke-slate-900" />

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
      <Button
        onClick={() => {
          properties.start();
        }}
      >
        Start Game
      </Button>

      <Button
        onClick={() => {
          properties.end();
        }}
      >
        End Game
      </Button>
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
    <div>
      <StoneCount playing={properties.playing} black={countBlack()} white={countWhite()} color={properties.color} />
      <PlayButtons start={properties.start} end={properties.end} />
    </div>
  );
};
