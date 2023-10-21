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

  console.log("game start id(%d)", bp);

  const gameMove = async () => {
    let nextMove;
    if (isHuman(isBlack(bp), players)) {
      setBoard(getBoard(bp, true));

      try {
        nextMove = await humanInput.request();
      } catch {
        deinit(bp);
        console.log("game interrupted id(%d)", bp);

        return;
      }
    } else {
      setBoard(getBoard(bp, false));
      nextMove = ai(bp);
      await sleep(500);
    }

    move(bp, nextMove);
    if (!runGame) {
      deinit(bp);
      console.log("game interrupted id(%d)", bp);
    } else if (isEnd(bp)) {
      deinit(bp);
      console.log("game end id(%d)", bp);
    } else {
      setTimeout(() => {
        void gameMove();
      }, 0);
    }
  };

  setTimeout(() => {
    void gameMove();
  }, 0);

  return () => {
    deinit(bp);
    runGame = false;
  };
};

const isHuman = (isBlack: boolean, players: Players): boolean => {
  return (isBlack && players.black === HumanPlayer) || (!isBlack && players.white === HumanPlayer);
};
