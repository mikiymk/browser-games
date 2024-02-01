import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAi, PlayerTypeHuman, playerType } from "@/scripts/player";
import type { JSXElement } from "solid-js";
import { createResource, createSignal } from "solid-js";
import { CellCanMoveBlack, CellCanMoveWhite, CellEmpty } from "../const";
import { gameLoop } from "../game-loop";
import { getReversiWasm } from "../get-wasm";
import { ReversiBoard } from "./board";
import { Info } from "./information";

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

  const handleEnd = (): void => {
    terminateGame();
    setBoard(emptyBoard);
  };

  const handleClick = (square: number, index: number): void => {
    if (square !== CellCanMoveBlack && square !== CellCanMoveWhite) {
      return;
    }

    resolve(index);
  };

  return (
    <>
      <ReversiBoard board={board()} click={handleClick} />
      <Info start={handleStart} end={handleEnd} playing={gamePlaying()} board={board()} color={getColor?.()} />
    </>
  );
};
