import { createSignal } from "solid-js";
import { Board } from "./board";
import { Black, BoardData, BoardLength, Empty, Index, InputType, Mark, PromotionPieces, Reset, White } from "./types";
import { Controller } from "./controller";
import { PlayerType, PlayerTypeAI, PlayerTypeHuman, selectPlayer } from "../../common/types";
import { gameLoop } from "./game";
import { aiPlayer, createHumanPlayer, createMessenger } from "./ai";
import { PromotionPopup } from "./promotion-popup";

export const App = () => {
  const [board, setBoard] = createSignal(Array.from({ length: BoardLength }).fill(Empty) as BoardData);
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

    setBoard((board) => {
      return board.map(() => Empty) as BoardData;
    });

    const players = {
      [White]: selectPlayer(playerWhite(), humanPlayer, aiPlayer),
      [Black]: selectPlayer(playerBlack(), humanPlayer, aiPlayer),
    };
    console.log(playerWhite(), playerBlack());

    void gameLoop(players, board, setBoard, setStatus);
  };

  return (
    <>
      <Board board={board()} setInput={humanInputSender} movableSquares={movable()} />
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
