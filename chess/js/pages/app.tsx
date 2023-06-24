import { createSignal } from "solid-js";
import { Board } from "./board";
import { Black, Index, InputType, Mark, PromotionPieces, Reset, White } from "@/chess/js/types";
import { Controller } from "./controller";
import { PlayerType, PlayerTypeAI, PlayerTypeHuman, selectPlayer } from "@/common/types";
import { gameLoop } from "@/chess/js/game";
import { aiPlayer, createHumanPlayer, createMessenger } from "@/chess/js/ai";
import { PromotionPopup } from "./promotion-popup";
import { generateState } from "../game/state";
import { add, game } from "@/chess/wasm/pkg/chess_wasm";

export const App = () => {
  const [state, setState] = createSignal(generateState());
  const [status, setStatus] = createSignal("");
  const [playerWhite, setPlayerWhite] = createSignal<PlayerType>(PlayerTypeHuman);
  const [playerBlack, setPlayerBlack] = createSignal<PlayerType>(PlayerTypeAI);
  const [movable, setMovable] = createSignal<Index[]>([]);
  const [promotionMark, setPromotionMark] = createSignal<Mark>();

  const [humanInputSender, humanInputReceiver] = createMessenger<InputType>();
  const [humanPromotionSender, humanPromotionReceiver] = createMessenger<PromotionPieces>();

  const humanPlayer = createHumanPlayer(
    // humanInputReceiver,
    () => Promise.reject(),
    setMovable,
    humanPromotionReceiver,
    setPromotionMark,
  );

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

    void game(
      0,
      1,
      (state: unknown) => {
        console.log("set state", state);
      },
      (highlight: unknown) => {
        console.log("highlight", highlight);

        setMovable(highlight as Index[]);
      },
      humanInputReceiver,
    );

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
      {1} + {2} = {add(1, 2)}
    </>
  );
};
