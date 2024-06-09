import { PageBody } from "@/components/page-body/page-body";
import { PageHeader } from "@/components/page-header/page-header";
import { CellKnight, CellMovable, CellVisited } from "@/games/knight-tour/consts";
import { createGame } from "@/games/knight-tour/create-game";
import { setKnightMovable } from "@/games/knight-tour/knight-move";
import { createUrlQuerySignal } from "@/scripts/use-url-query";
import type { JSXElement } from "solid-js";
import { onMount } from "solid-js";
import { KnightBoard } from "./board";
import { History } from "./history";
import { HowToPlay } from "./how-to-play";
import { Settings } from "./settings";

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
    <>
      <PageHeader
        buttons={
          <>
            <History history={history()} back={backHistory} />
            <Settings hint={hint()} setHint={setHint} />
            <HowToPlay />
          </>
        }
      />
      <PageBody>
        <KnightBoard board={board()} handleClick={handleClick} hintMode={hint() !== "hide"} />
      </PageBody>
    </>
  );
};
