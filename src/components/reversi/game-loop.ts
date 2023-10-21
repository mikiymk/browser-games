import { sleep } from "@/scripts/sleep";

import { HumanPlayer } from "./const";

import type { MultiPromise } from "@/scripts/multi-promise";
import type { ReversiWasmConnect } from "./get-wasm";

type Players = { black: number; white: number };

export const gameLoop = (
  wasm: ReversiWasmConnect,
  setBoard: (board: number[]) => void,
  humanInput: MultiPromise<number>,
  players: Players,
) => {
  const { init, deinit, getBoard, move, isBlack, isEnd, ai } = wasm;

  const bp = init();
  let runGame = true;
  const endGame = () => {
    deinit(bp);
    runGame = false;
  };

  const gameMove = async () => {
    let nextMove;
    if (isHuman(isBlack(bp), players)) {
      nextMove = await humanInput.request();
    } else {
      nextMove = ai(bp);
      await sleep(500);
    }

    move(bp, nextMove);
    setBoard(getBoard(bp));

    if (runGame && !isEnd(bp)) {
      setTimeout(() => {
        void gameMove();
      }, 100);
    } else {
      console.log("game end id(%d)", bp);
    }
  };

  setTimeout(() => {
    setBoard(wasm.getBoard(bp));

    void gameMove();
  }, 0);

  return endGame;
};

const isHuman = (isBlack: boolean, players: Players): boolean => {
  return (isBlack && players.black === HumanPlayer) || (!isBlack && players.white === HumanPlayer);
};
