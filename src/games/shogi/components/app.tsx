import { createResource } from "solid-js";
import type { JSXElement } from "solid-js";
import { ShogiBoard } from "./board";
import { PlayerTypeAi, PlayerTypeHuman, playerType } from "@/scripts/player";
import { gameLoop, getWasm } from "../game-loop";
import { doNothingFunction } from "@/scripts/do-nothing";
import { BLACK, EMPTY, MOVE_TARGET, WHITE } from "../constants";
import { createStore } from "solid-js/store";
import { MultiPromise } from "@/scripts/multi-promise";

export const App = (): JSXElement => {
  const query = new URLSearchParams(location.search);

  const playerBlack = playerType(query.get("first"), PlayerTypeHuman);
  const playerWhite = playerType(query.get("second"), PlayerTypeAi);

  const [board, setFullBoard] = createStore<readonly { piece: number; moveTarget: boolean }[]>(
    Array.from({ length: 81 }, (_, index) => ({ piece: index % 16, moveTarget: false })),
  );
  const [wasm] = createResource(getWasm);

  const setBoard = (board: readonly number[]): void => {
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    setFullBoard((fullBoard) => {
      for (const [index, element] of fullBoard.entries()) {
        element.piece = board[index] ?? EMPTY;
      }
      return fullBoard;
    });
  };

  const setMove = (moves: readonly number[]): void => {
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    setFullBoard((fullBoard) => {
      for (const [index, element] of fullBoard.entries()) {
        element.moveTarget = moves[index] === MOVE_TARGET;
      }
      return fullBoard;
    });
  };

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
    terminate = gameLoop(wasmObject, doNothingFunction, setBoard, doNothingFunction, setMove, humanInput, {
      [BLACK]: playerBlack,
      [WHITE]: playerWhite,
    });
  };

  const handleBoardClick = (index: number): void => {
    resolve(index);
  };

  return (
    <>
      <ShogiBoard board={board} onSquareClick={handleBoardClick} />
      <button type="button" onClick={start}>
        Start
      </button>
    </>
  );
};
