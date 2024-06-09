import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAi, PlayerTypeHuman, playerType } from "@/scripts/player";
import type { JSXElement } from "solid-js";
import { createResource, createSignal } from "solid-js";
import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, CellWhite } from "../const";
import { gameLoop } from "../game-loop";
import { getReversiWasm } from "../get-wasm";
import { ReversiBoard } from "./board";
import { StoneCount } from "./information";
import { PageHeader } from "@/components/page-header/page-header";
import { PageBody } from "@/components/page-body/page-body";
import { StartButton } from "@/components/page-header/start-button";

const emptyBoard: number[] = Array.from({ length: 64 }, () => CellEmpty);

export const App = (): JSXElement => {
  const query = new URLSearchParams(location.search);

  const black = playerType(query.get("black"), PlayerTypeHuman);
  const white = playerType(query.get("white"), PlayerTypeAi);

  const [gamePlaying, setGamePlaying] = createSignal(false);

  const [board, setBoard] = createSignal(emptyBoard);

  const [wasm] = createResource(getReversiWasm);
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
        black,
        white,
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
            <StartButton start={handleStart} />
          </>
        }
      />
      <PageBody>
        <ReversiBoard board={board()} click={handleClick} />
      </PageBody>
    </>
  );
};
