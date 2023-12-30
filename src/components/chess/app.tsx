import { createResource, createSignal } from "solid-js";

import { createBoard } from "@/games/chess/board";
import { Board } from "@/games/chess/components/board";
import { EndNotYet, White } from "@/games/chess/constants";
import { gameLoop, getWasm } from "@/games/chess/game-loop";
import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";

import { Controller } from "./controller";

import type { BoardCell } from "@/games/chess/board";
import type { PlayerType } from "@/scripts/player";

export const App = () => {
  const [playerWhite, setPlayerWhite] = createSignal<PlayerType>(PlayerTypeHuman);
  const [playerBlack, setPlayerBlack] = createSignal<PlayerType>(PlayerTypeAi);

  const [color, setColor] = createSignal(White);
  const [end, setEnd] = createSignal(EndNotYet);

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
