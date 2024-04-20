import { Button } from "@/components/button";
import { CellKnight, CellMovable, CellVisited } from "@/games/knight-tour/consts";
import { createGame } from "@/games/knight-tour/create-game";
import { setKnightMovable } from "@/games/knight-tour/knight-move";
import { PopUp } from "@/games/shogi/components/pop-up";
import type { JSXElement } from "solid-js";
import { createSignal, onMount } from "solid-js";
import { KnightBoard } from "./board";
import { History } from "./history";

export const App = (): JSXElement => {
  const query = new URLSearchParams(location.search);
  const hintMode = query.get("board") === "hint";

  const { board, history, resetBoard, reset, setHistory, backHistory } = createGame();
  const [open, setOpen] = createSignal(false);

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

  const handleOpen = (): void => {
    setOpen(true);
  };
  const handleClose = (): void => {
    setOpen(false);
  };

  onMount(reset);

  return (
    <>
      <KnightBoard board={board()} handleClick={handleClick} hintMode={hintMode} />
      <Button onClick={handleOpen}>History</Button>
      <PopUp open={open()}>
        <History history_={history()} back_={backHistory} />
        <Button onClick={handleClose}>Close</Button>
      </PopUp>
    </>
  );
};
