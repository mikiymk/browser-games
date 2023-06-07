import { createSignal, onMount } from "solid-js";
import { BoardData, Empty, OMark, PlayerType, PlayerTypeAI, PlayerTypeHuman, Reset, XMark } from "./types";
import { Board } from "./board";
import { Controller } from "./controller";
import { gameLoop } from "./game";
import { GameAiPromise, aiPlayer, humanPlayer } from "./ai";

const initialBoardData: BoardData = [Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty];

export const App = () => {
  const { board, setBoardData } = createBoard();
  const [playerO, setPlayerO] = createSignal<PlayerType>(PlayerTypeHuman);
  const [playerX, setPlayerX] = createSignal<PlayerType>(PlayerTypeAI);
  const [status, setStatus] = createSignal("");

  const reset = () => {
    setBoardData(initialBoardData);

    GameAiPromise.resolve(Reset);

    const players = {
      [OMark]: playerO() === PlayerTypeHuman ? humanPlayer : aiPlayer,
      [XMark]: playerX() === PlayerTypeHuman ? humanPlayer : aiPlayer,
    };

    void gameLoop(players, board, setBoardData, setStatus);
  };

  onMount(reset);

  return (
    <>
      <Board board={board()} />

      <Controller
        statusMessage={status()}
        onReset={reset}
        playerO={playerO()}
        playerX={playerX()}
        setPlayerO={setPlayerO}
        setPlayerX={setPlayerX}
      />
    </>
  );
};

const createBoard = () => {
  const [board, setBoardData] = createSignal<BoardData>(initialBoardData);

  return {
    board,
    setBoardData,
  };
};
