import { createBoard } from "@/games/chess/board";
import type { BoardCell } from "@/games/chess/board";
import { EndNotYet, White } from "@/games/chess/constants";
import { gameLoop, getWasm } from "@/games/chess/game-loop";
import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAi, PlayerTypeHuman, playerType } from "@/scripts/player";
import type { JSXElement } from "solid-js";
import { createResource, createSignal } from "solid-js";
import { Board } from "./board";
import { Controller } from "./controller";

export const App = (): JSXElement => {
  const query = new URLSearchParams(location.search);

  const playerWhite = playerType(query.get("white"), PlayerTypeHuman);
  const playerBlack = playerType(query.get("black"), PlayerTypeAi);

  const [color, setColor] = createSignal(White);
  const [end, setEnd] = createSignal(EndNotYet);

  const { board, setPiece, setMark } = createBoard();
  const [wasm] = createResource(getWasm);

  let resolve: (value: number) => void = doNothingFunction;
  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  let terminate = doNothingFunction;
  const start = (): void => {
    terminate();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }
    terminate = gameLoop(wasmObject, setColor, setPiece, setEnd, setMark, humanInput, {
      white: playerWhite,
      black: playerBlack,
    });
  };

  const handleClick = (_square: BoardCell, index: number): void => {
    resolve(index);
  };

  return (
    <>
      <Board board={board()} handleClick={handleClick} />
      <Controller color={color()} end={end()} start={start} />
    </>
  );
};
