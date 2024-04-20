import { Button } from "@/components/button";
import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAi, PlayerTypeHuman, playerType } from "@/scripts/player";
import { createResource, createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import type { Hand } from "../constants";
import { BLACK, MOVE_TARGET, WHITE } from "../constants";
import { gameLoop, getWasm } from "../game-loop";
import { ShogiBoard } from "./board";
import { GameOverPopUp } from "./game-over-pop-up";
import { PromotionPopUp } from "./promotion-pop-up";

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
  const [gameOver, setGameOver] = createSignal<number>(0);
  const [promotion, setPromotion] = createSignal(false);
  const [wasm] = createResource(getWasm);

  const setBoard = (board: readonly number[]): void => {
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
    terminate();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }
    terminate = gameLoop(
      wasmObject,
      doNothingFunction,
      setBoard,
      setGameOver,
      setMove,
      setHands,
      setPromotion,
      humanInput,
      {
        [WHITE]: playerBlack,
        [BLACK]: playerWhite,
      },
    );
  };

  const handleBoardClick = (index: number): void => {
    resolve(index);
  };

  return (
    <>
      <ShogiBoard board={board()} hands={[whiteHands(), blackHands()]} onSquareClick={handleBoardClick} />
      <Button onClick={start}>Start</Button>
      <GameOverPopUp gameOver={gameOver() !== 0} set={setGameOver} />
      <PromotionPopUp
        promotion={promotion()}
        resolve={(value) => {
          resolve(value);
        }}
      />
    </>
  );
};
