import { createResource, createSignal } from "solid-js";

import { PlayerTypeAI, PlayerTypeHuman } from "@/scripts/player";
import { gameLoop, getWasm } from "@/games/chess/game-loop";
import { createBoard } from "@/games/chess/board";
import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { Board } from "@/games/chess/components/board";
import { White } from "@/games/chess/constants";

import { Controller } from "./controller";

import type { BoardCell } from "@/games/chess/board";
import type { PlayerType } from "@/scripts/player";

export const App = () => {
  const [playerWhite, setPlayerWhite] = createSignal<PlayerType>(PlayerTypeHuman);
  const [playerBlack, setPlayerBlack] = createSignal<PlayerType>(PlayerTypeAI);

  const [color, setColor] = createSignal(White);
  const [end, setEnd] = createSignal(0);

  const { board, setPiece, setMark } = createBoard();
  const [wasm] = createResource(getWasm);

  let resolve: (value: number) => void = doNothingFunction;
  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  let terminate = doNothingFunction;
  const start = () => {
    terminate();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }
    terminate = gameLoop(wasmObject, setColor, setPiece, setEnd, setMark, humanInput, {
      white: playerWhite(),
      black: playerBlack(),
    });
  };

  const handleClick = (_square: BoardCell, index: number) => {
    resolve(index);
  };

  return (
    <>
      <Board board={board()} handleClick={handleClick} />

      <Controller
        color={color()}
        end={end()}
        start={start}
        playerWhite={playerWhite()}
        playerBlack={playerBlack()}
        setPlayerWhite={setPlayerWhite}
        setPlayerBlack={setPlayerBlack}
      />
    </>
  );
};
