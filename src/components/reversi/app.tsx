import { createResource, createSignal } from "solid-js";

import { MultiPromise } from "@/scripts/multi-promise";

import { Board } from "./board";
import { AiPlayer, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, HumanPlayer } from "./const";
import { gameLoop } from "./game-loop";
import { getReversiWasm } from "./get-wasm";
import { Info } from "./information";
import { Settings } from "./settings";

const emptyFunction = () => {
  // empty
};
const emptyBoard: number[] = Array.from({ length: 64 }, () => CellEmpty);

export const App = () => {
  const [gamePlaying, setGamePlaying] = createSignal(false);

  const [board, setBoard] = createSignal(emptyBoard);
  const [blackPlayer, setBlackPlayer] = createSignal(HumanPlayer);
  const [whitePlayer, setWhitePlayer] = createSignal(AiPlayer);

  const [enableWatch, setEnableWatch] = createSignal(false);

  const [wasm] = createResource(getReversiWasm);
  let terminateGame: () => void = emptyFunction;
  let getColor: (() => number) | undefined;

  let resolve: (value: number) => void = emptyFunction;

  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  const handleStart = () => {
    const exports = wasm();
    if (exports === undefined) return;
    terminateGame();

    const { terminate, color } = gameLoop(
      exports,
      setBoard,
      humanInput,
      {
        black: blackPlayer(),
        white: whitePlayer(),
      },
      () => {
        setGamePlaying(false);
      },
    );

    terminateGame = terminate;
    getColor = color;
    setGamePlaying(true);
  };

  const handleEnd = () => {
    terminateGame();
    setBoard(emptyBoard);
  };

  const handleClick = (square: number, index: number) => {
    if (square !== CellCanMoveBlack && square !== CellCanMoveWhite) {
      return;
    }

    resolve(index);
  };

  return (
    <>
      <Board board={board()} click={handleClick} />
      <Info
        start={handleStart}
        end={handleEnd}
        playing={gamePlaying()}
        board={board()}
        enable={enableWatch()}
        color={getColor?.()}
      />
      <Settings
        playing={gamePlaying()}
        black={blackPlayer()}
        setBlack={setBlackPlayer}
        white={whitePlayer()}
        setWhite={setWhitePlayer}
        enableWatch={enableWatch()}
        setEnableWatch={setEnableWatch}
      />
    </>
  );
};