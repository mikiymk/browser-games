import { createSignal } from "solid-js";
import { Board } from "./board";
import { Black, BoardData, BoardLength, Empty, White } from "./types";
import { Controller } from "./controller";
import { PlayerType, PlayerTypeAI, PlayerTypeHuman } from "../../common/types";
import { gameLoop } from "./game";

export const App = () => {
  const [board, setBoard] = createSignal(Array.from({ length: BoardLength }).fill(Empty) as BoardData);
  const [status, setStatus] = createSignal("");
  const [playerWhite, setPlayerWhite] = createSignal<PlayerType>(PlayerTypeHuman);
  const [playerBlack, setPlayerBlack] = createSignal<PlayerType>(PlayerTypeAI);

  const reset = () => {
    setBoard((board) => {
      return board.map(() => Empty) as BoardData;
    });

    const players = {
      [Black]: 1,
      [White]: 0,
    };

    void gameLoop(players, board, setBoard, setStatus);
  };

  return (
    <>
      <Board boardData={board()} />
      <Controller
        statusMessage={status()}
        reset={reset}
        playerWhite={playerWhite()}
        playerBlack={playerBlack()}
        setPlayerWhite={setPlayerWhite}
        setPlayerBlack={setPlayerWhite}
      />
    </>
  );
};
