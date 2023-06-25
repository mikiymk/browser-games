import { stateToFen } from "./game/fen";
import { isFinished } from "./game/finish";
import { getNextState } from "./game/get-next";
import { generateState } from "./game/state";
import { Black, Reset, Resign } from "./types";

import type { GameState, Players } from "./types";
import type { Accessor, Setter } from "solid-js";

export const gameLoop = async (
  players: Players,
  state: Accessor<GameState>,
  setState: Setter<GameState>,
  setMessage: Setter<string>,
) => {
  setState(generateState());

  console.log("start game");
  console.log(stateToFen(state()));

  for (;;) {
    setMessage(state().mark === Black ? "Black turn" : "White turn");

    const move = await players[state().mark].getMove(state());

    if (move.type === Reset || move.type === Resign) {
      break;
    }

    setState((state) => getNextState(state, move));
    console.log(stateToFen(state()));

    if (isFinished(state(), setMessage)) {
      break;
    }
  }

  console.log("end game");
};
