import { is_finished } from "@/wasms/chess/pkg/chess_wasm";

import { convertBoardToWasmBoard } from "./wasm-convert";

import type { GameState } from "@/games/chess/types";
import type { Setter } from "solid-js";

export const isFinished = (state: GameState, setMessage?: Setter<string>): boolean => {
  const message = (message: string) => {
    setMessage?.(message);
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const finishMessage = is_finished(convertBoardToWasmBoard(state.board), state.mark, state.castling, state.enPassant);

  if (finishMessage !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    message(finishMessage);

    return true;
  }

  if (state.fiftyMove > 100) {
    console.log("no capture and no pawn while 50 moves");

    message("Draw - fifty-move rule");
    return true;
  }

  for (const [boardString, value] of state.threefold) {
    if (value >= 3) {
      console.log(`threefold repetition ${boardString}`);

      message("Draw - threefold repetition");
      return true;
    }
  }

  return false;
};