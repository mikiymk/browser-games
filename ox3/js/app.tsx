import { createSignal, onMount } from "solid-js";

import { PlayerTypeHuman, PlayerTypeAI } from "@/common/types";

import { GameAiPromise, aiPlayer, humanPlayer } from "./ai";
import { Board } from "./board";
import { Controller } from "./controller";
import { gameLoop } from "./game";
import { Empty, OMark, Reset, XMark } from "./types";

import type { BoardData } from "./types";
import type { PlayerType } from "@/common/types";

const initialBoardData: BoardData = [Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty];

export const App = () => {
  const [board, setBoardData] = createSignal<BoardData>(initialBoardData);
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
