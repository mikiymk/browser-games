import { createSignal, onMount } from "solid-js";

import { GameAiPromise, aiPlayer, humanPlayer } from "@/games/nought-and-cross/ai";
import { gameLoop } from "@/games/nought-and-cross/game";
import { Empty, OMark, Reset, XMark } from "@/games/nought-and-cross/types";
import { PlayerTypeAI, PlayerTypeHuman } from "@/scripts/player";

import { Board } from "./board";
import { Controller } from "./controller";

import type { BoardData } from "@/games/nought-and-cross/types";
import type { PlayerType } from "@/scripts/player";

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
