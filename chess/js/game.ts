import { Accessor, Setter } from "solid-js";
import { Black, GameState, Players, Reset } from "./types";
import { isFinished } from "./game/finish";
import { getNextState } from "./game/get-next";
import { stateToFen } from "./game/fen";
import { generateState } from "./game/state";

export const gameLoop = async (
  players: Players,
  state: Accessor<GameState>,
  setState: Setter<GameState>,
  setMessage: Setter<string>,
) => {
  setState(generateState());

  console.log("start game");

  for (;;) {
    console.log(stateToFen(state()));

    const player = players[state().mark];

    setMessage(state().mark === Black ? "Black turn" : "White turn");

    const move = await player.getMove(state().board, state().mark, state().castling, state().enPassant);

    if (move.type === Reset) {
      break;
    }

    setState((state) => getNextState(state, move));

    if (isFinished(state(), setMessage)) {
      break;
    }
  }

  console.log("end game");
};
