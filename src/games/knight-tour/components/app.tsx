import type { JSXElement } from "solid-js";
import { onMount } from "solid-js";
import { createUrlQuerySignal } from "../../../scripts/use-url-query.ts";
import { CellKnight, CellMovable, CellVisited } from "../consts.ts";
import { createGame } from "../create-game.ts";
import { setKnightMovable } from "../knight-move.ts";
import { KnightBoard } from "./board.tsx";
import { History } from "./history.tsx";
import { HowToPlayKnightTour } from "./how-to-play.tsx";
import { KnightTourSettings } from "./settings.tsx";
import { Page } from "../../../components/page/page.tsx";

export const App = (): JSXElement => {
  const [hint, setHint] = createUrlQuerySignal("board", "hide");

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
    <Page
      header={
        <>
          <History history={history()} back={backHistory} />
          <KnightTourSettings hint={hint()} setHint={setHint} />
          <HowToPlayKnightTour />
        </>
      }
    >
      <KnightBoard board={board()} handleClick={handleClick} hintMode={hint() !== "hide"} />
    </Page>
  );
};
