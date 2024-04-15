import { createEffect, createResource, createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import { ShogiBoard } from "./board";
import { PlayerTypeAi, PlayerTypeHuman, playerType } from "@/scripts/player";
import { gameLoop, getWasm } from "../game-loop";
import { doNothingFunction } from "@/scripts/do-nothing";
import type { Hand } from "../constants";
import { WHITE, EMPTY, MOVE_TARGET, BLACK } from "../constants";
import { produce } from "solid-js/store";
import { MultiPromise } from "@/scripts/multi-promise";
import { MoveTarget } from "@/games/chess/constants";

// memo
// motigoma

export const App = (): JSXElement => {
  const query = new URLSearchParams(location.search);

  const playerBlack = playerType(query.get("first"), PlayerTypeHuman);
  const playerWhite = playerType(query.get("second"), PlayerTypeAi);

  const [board, setFullBoard] = createSignal<readonly { piece: number; moveTarget: boolean }[]>(
    Array.from({ length: 81 }, () => ({ piece: 0, moveTarget: false })),
  );
  const [whiteHands, setWhiteHands] = createSignal<Hand>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [blackHands, setBlackHands] = createSignal<Hand>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [wasm] = createResource(getWasm);

  createEffect(() => {
    console.group("state changed");
    console.log("board", board());
    console.log("whiteHands", whiteHands());
    console.log("blackHands", blackHands());
    console.groupEnd();
  });

  const setBoard = (board: readonly number[]): void => {
    console.log("setBoard", board);

    setFullBoard(
      (
        previousBoard: readonly {
          readonly piece: number;
          readonly moveTarget: boolean;
        }[],
      ) => {
        const newBoard = previousBoard.map((element, index) => ({
          ...element,
          piece: board[index] ?? 0,
        }));

        return newBoard;
      },
    );
  };

  const setMove = (moves: readonly number[]): void => {
    console.log("setMove", moves);

    setFullBoard(
      (
        previousBoard: readonly {
          readonly piece: number;
          readonly moveTarget: boolean;
        }[],
      ) => {
        const newBoard = previousBoard.map((element, index) => ({
          ...element,
          moveTarget: moves[index] === MOVE_TARGET,
        }));

        return newBoard;
      },
    );
  };

  const setHands = (hands: readonly [Hand, Hand]): void => {
    setWhiteHands(hands[0]);
    setBlackHands(hands[1]);
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
    terminate = gameLoop(wasmObject, doNothingFunction, setBoard, doNothingFunction, setMove, setHands, humanInput, {
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
      <ShogiBoard board={board()} hands={[whiteHands(), blackHands()]} onSquareClick={handleBoardClick} />
      <button type="button" onClick={start}>
        Start
      </button>
    </>
  );
};
