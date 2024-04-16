import { CellKnight, CellMovable, CellVisited } from "@/games/knight-tour/consts";
import { createGame } from "@/games/knight-tour/create-game";
import { setKnightMovable } from "@/games/knight-tour/knight-move";
import type { JSXElement } from "solid-js";
import { onMount } from "solid-js";
import { KnightBoard } from "./board";
import { History } from "./history";

export const App = (): JSXElement => {
  const query = new URLSearchParams(location.search);
  const hintMode = query.get("board") === "hint";

  const { board, history, resetBoard, reset, setHistory, backHistory } = createGame();

  const handleClick = (index: number): void => {
    if (board()[index] !== CellMovable) {
      return;
    }

    setHistory((history) => [...history, index]);
    resetBoard((board) => {
      const previousKnightIndex = board.indexOf(CellKnight);

      return setKnightMovable(board, index).with(previousKnightIndex, CellVisited);
    });
  };

  onMount(reset);

  return (
    <>
      <KnightBoard board={board()} handleClick={handleClick} hintMode={hintMode} />
      <History history_={history()} back_={backHistory} />
    </>
  );
};
