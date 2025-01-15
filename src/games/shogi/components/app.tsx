import { Start } from "@/components/header-buttons/start";
import { PageBody } from "@/components/page/body";
import { PageHeader } from "@/components/page/header";
import { doNothingFunction } from "@/scripts/do-nothing";
import { MultiPromise } from "@/scripts/multi-promise";
import { PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import { usePromise } from "@/scripts/use-promise";
import { createUrlQuerySignal } from "@/scripts/use-url-query";
import { createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import type { Hand } from "../constants";
import { BLACK, MOVE_TARGET, WHITE } from "../constants";
import { gameLoop, getWasm } from "../game-loop";
import { ShogiBoard } from "./board";
import { GameOverPopUp } from "./game-over-pop-up";
import { PromotionPopUp } from "./promotion-pop-up";
import { Settings } from "./settings";

export const App = (): JSXElement => {
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("first", PlayerTypeHuman);
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("second", PlayerTypeAi);

  const [board, setFullBoard] = createSignal<readonly { piece: number; moveTarget: boolean }[]>(
    Array.from({ length: 81 }, () => ({ piece: 0, moveTarget: false })),
  );
  const [whiteHands, setWhiteHands] = createSignal<Hand>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [blackHands, setBlackHands] = createSignal<Hand>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [gameOver, setGameOver] = createSignal<number>(0);
  const [promotion, setPromotion] = createSignal(false);
  const wasm = usePromise(getWasm);

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
        [WHITE]: black(),
        [BLACK]: white(),
      },
    );
  };

  const handleBoardClick = (index: number): void => {
    resolve(index);
  };

  return (
    <>
      <PageHeader
        buttons={
          <>
            <Start start={start} />
            <Settings white={white()} black={black()} setWhite={setWhite} setBlack={setBlack} />
            <GameOverPopUp gameOver={gameOver() !== 0} set={setGameOver} />
            <PromotionPopUp
              promotion={promotion()}
              resolve={(value) => {
                resolve(value);
              }}
            />
          </>
        }
      />
      <PageBody>
        <ShogiBoard board={board()} hands={[whiteHands(), blackHands()]} onSquareClick={handleBoardClick} />
      </PageBody>
    </>
  );
};
