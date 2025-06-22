import { Page } from "../../../common/components/page-frame/page.tsx";
import { createUrlQuerySignal } from "../../../common/scripts/use-url-query.ts";
import { createGame } from "../game.ts";
import { KnightBoard } from "./board.tsx";
import { History } from "./history.tsx";
import { HowToPlayKnightTour } from "./how-to-play.tsx";
import { KnightTourSettings } from "./settings.tsx";

import type { JSXElement } from "solid-js";

export const App = (): JSXElement => {
  const [hint, setHint] = createUrlQuerySignal("board", "hide");
  const { backHistory, board, handleClick, history } = createGame();

  return (
    <Page
      header={
        <>
          <History back={backHistory} history={history()} />
          <KnightTourSettings hint={hint()} setHint={setHint} />
          <HowToPlayKnightTour />
        </>
      }
    >
      <KnightBoard board={board()} handleClick={handleClick} hintMode={hint() !== "hide"} />
    </Page>
  );
};
