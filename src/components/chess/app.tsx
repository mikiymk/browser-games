import { createSignal } from "solid-js";

import { aiPlayer, createHumanPlayer, createMessenger } from "@/games/chess/ai";
import { gameLoop } from "@/games/chess/game";
import { Black, Reset, White } from "@/games/chess/types";
import { PlayerTypeAI, PlayerTypeHuman, selectPlayer } from "@/scripts/player";

import { Board } from "./board";
import { Controller } from "./controller";
import { PromotionPopup } from "./promotion-popup";

import type { Index, InputType, Mark, PromotionPieces } from "@/games/chess/types";
import type { PlayerType } from "@/scripts/player";

import { generateState } from "@/games/chess/state";

export const App = () => {
  const [state, setState] = createSignal(generateState());
  const [status, setStatus] = createSignal("");
  const [playerWhite, setPlayerWhite] = createSignal<PlayerType>(PlayerTypeHuman);
  const [playerBlack, setPlayerBlack] = createSignal<PlayerType>(PlayerTypeAI);
  const [movable, setMovable] = createSignal<Index[]>([]);
  const [promotionMark, setPromotionMark] = createSignal<Mark>();

  const [humanInputSender, humanInputReceiver] = createMessenger<InputType>();
  const [humanPromotionSender, humanPromotionReceiver] = createMessenger<PromotionPieces>();

  const humanPlayer = createHumanPlayer(humanInputReceiver, setMovable, humanPromotionReceiver, setPromotionMark);

  const reset = () => {
    humanInputSender(Reset);

    setState(() => {
      return generateState();
    });

    const players = {
      [White]: selectPlayer(playerWhite(), humanPlayer, aiPlayer),
      [Black]: selectPlayer(playerBlack(), humanPlayer, aiPlayer),
    };
    console.log(playerWhite(), playerBlack());

    void gameLoop(players, state, setState, setStatus);
  };

  return (
    <>
      <Board board={state().board} setInput={humanInputSender} movableSquares={movable()} />
      <Controller
        statusMessage={status()}
        reset={reset}
        playerWhite={playerWhite()}
        playerBlack={playerBlack()}
        setPlayerWhite={setPlayerWhite}
        setPlayerBlack={setPlayerBlack}
      />
      <PromotionPopup mark={promotionMark()} setInput={humanPromotionSender} />
    </>
  );
};
