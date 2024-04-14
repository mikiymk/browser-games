import { createResource } from "solid-js";
import type { JSXElement } from "solid-js";
import { ShogiBoard } from "./board";
import { PlayerTypeAi, PlayerTypeHuman, playerType } from "@/scripts/player";
import { gameLoop, getWasm } from "../game-loop";
import { doNothingFunction } from "@/scripts/do-nothing";
import { WHITE, EMPTY, MOVE_TARGET, BLACK } from "../constants";
import { createStore, produce } from "solid-js/store";
import { MultiPromise } from "@/scripts/multi-promise";


// memo
// motigoma


export const App = (): JSXElement => {
  const query = new URLSearchParams(location.search);

  const playerBlack = playerType(query.get("first"), PlayerTypeHuman);
  const playerWhite = playerType(query.get("second"), PlayerTypeAi);

  const [board, setFullBoard] = createStore<readonly { piece: number; moveTarget: boolean }[]>(
    Array.from({ length: 81 }, () => ({ piece: 0, moveTarget: false })),
  );
  const [wasm] = createResource(getWasm);

  const setBoard = (board: readonly number[]): void => {
    setFullBoard(
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      produce((fullBoard) => {
        for (const [index, element] of fullBoard.entries()) {
          element.piece = board[index] ?? EMPTY;
        }
      }),
    );
  };

  const setMove = (moves: readonly number[]): void => {
    setFullBoard(
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      produce((fullBoard) => {
        for (const [index, element] of fullBoard.entries()) {
          element.moveTarget = moves[index] === MOVE_TARGET;
        }
      }),
    );
  };

  let resolve: (value: number) => void = doNothingFunction;
  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  let terminate = doNothingFunction;
  const start = (): void => {
    console.log("start");

    terminate();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }
    terminate = gameLoop(wasmObject, doNothingFunction, setBoard, doNothingFunction, setMove, humanInput, {
      [WHITE]: playerBlack,
      [BLACK]: playerWhite,
    });
  };

  const handleBoardClick = (index: number): void => {
    console.log("index", index);
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
