import type { JSXElement } from "solid-js";
import { createSignal } from "solid-js";
import { PlayerSetting, Settings } from "../../../components/header-buttons/settings.ts";
import { Start } from "../../../components/header-buttons/start.ts";
import { PageBody } from "../../../components/page/body.ts";
import { PageHeader } from "../../../components/page/header.ts";
import { doNothingFunction } from "../../../scripts/do-nothing.ts";
import { MultiPromise } from "../../../scripts/multi-promise.ts";
import { PlayerTypeAi, PlayerTypeHuman } from "../../../scripts/player.ts";
import type { PlayerType } from "../../../scripts/player.ts";
import { usePromise } from "../../../scripts/use-promise.ts";
import { createUrlQuerySignal } from "../../../scripts/use-url-query.ts";
import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, CellWhite } from "../const.ts";
import { gameLoop } from "../game-loop.ts";
import { getReversiWasm } from "../get-wasm.ts";
import { ReversiBoard } from "./board.tsx";
import { HowToPlayReversi } from "./how-to-play.tsx";
import { StoneCount } from "./information.tsx";

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

    const { terminate, color } = gameLoop(
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
    <>
      <PageHeader
        buttons={
          <>
            <StoneCount count={countBlack()} color={CellBlack} isNext={gamePlaying() && getColor?.() === CellBlack} />
            <StoneCount count={countWhite()} color={CellWhite} isNext={gamePlaying() && getColor?.() === CellWhite} />
            <Start start={handleStart} />
            <Settings>
              <PlayerSetting white={white()} black={black()} setWhite={setWhite} setBlack={setBlack} />
            </Settings>
            <HowToPlayReversi />
          </>
        }
      />
      <PageBody>
        <ReversiBoard board={board()} click={handleClick} />
      </PageBody>
    </>
  );
};
