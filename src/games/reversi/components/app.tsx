import { createSignal } from "solid-js";

import { PlayerSetting, Settings } from "../../../common/components/header-buttons/settings.tsx";
import { Start } from "../../../common/components/header-buttons/start.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { doNothingFunction } from "../../../common/scripts/do-nothing.ts";
import { MultiPromise } from "../../../common/scripts/multi-promise.ts";
import { PlayerTypeAi, PlayerTypeHuman } from "../../../common/scripts/player.ts";
import { usePromise } from "../../../common/scripts/use-promise.ts";
import { createUrlQuerySignal } from "../../../common/scripts/use-url-query.ts";
import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, CellWhite } from "../constants.ts";
import { gameLoop } from "../game-loop.ts";
import { getReversiWasm } from "../get-wasm.ts";
import { ReversiBoard } from "./board.tsx";
import { HowToPlayReversi } from "./how-to-play.tsx";
import { StoneCount } from "./information.tsx";

import type { JSXElement } from "solid-js";

import type { PlayerType } from "../../../common/scripts/player.ts";

const emptyBoard: number[] = Array.from({ length: 64 }, () => CellEmpty);

export const App = (): JSXElement => {
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("black", PlayerTypeHuman);
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("white", PlayerTypeAi);

  const [gamePlaying, setGamePlaying] = createSignal(false);

  const [board, setBoard] = createSignal(emptyBoard);

  const wasm = usePromise(getReversiWasm);
  let terminateGame: () => void = doNothingFunction;
  let getColor: (() => number) | undefined;

  let resolve: (value: number) => void = doNothingFunction;

  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  const handleStart = (): void => {
    const exports = wasm();
    if (exports === undefined) {
      return;
    }
    terminateGame();

    const { color, terminate } = gameLoop(
      exports,
      setBoard,
      humanInput,
      {
        black: black(),
        white: white(),
      },
      () => {
        setGamePlaying(false);
      },
    );

    terminateGame = terminate;
    getColor = color;
    setGamePlaying(true);
  };

  const handleClick = (square: number, index: number): void => {
    if (square !== CellCanMoveBlack && square !== CellCanMoveWhite) {
      return;
    }

    resolve(index);
  };

  const count = (color: number): number => {
    return board().filter((square) => square === color).length;
  };
  const countBlack = (): number => count(CellBlack);
  const countWhite = (): number => count(CellWhite);

  return (
    <Page
      header={
        <>
          <StoneCount color={CellBlack} count={countBlack()} isNext={gamePlaying() && getColor?.() === CellBlack} />
          <StoneCount color={CellWhite} count={countWhite()} isNext={gamePlaying() && getColor?.() === CellWhite} />
          <Start start={handleStart} />
          <Settings>
            <PlayerSetting black={black()} setBlack={setBlack} setWhite={setWhite} white={white()} />
          </Settings>
          <HowToPlayReversi />
        </>
      }
    >
      <ReversiBoard board={board()} handleClick={handleClick} />
    </Page>
  );
};
