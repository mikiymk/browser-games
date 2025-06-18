import type { JSXElement } from "solid-js";

import { Start } from "../../../common/components/header-buttons/start.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { createNoughtAndCrossGame } from "../game.ts";
import { NncBoard } from "./board.tsx";
import { History } from "./history.tsx";
import { NoughtAndCrossSettings } from "./settings.tsx";
import { StatusButton } from "./status.tsx";

export const App = (): JSXElement => {
  const { board, handleClick, history, playerO, playerX, reset, setPlayerO, setPlayerX, status } =
    createNoughtAndCrossGame();

  return (
    <Page
      header={
        <>
          <StatusButton status={status()} />
          <Start start={reset} />
          <History history={history()} />
          <NoughtAndCrossSettings o={playerO()} setO={setPlayerO} setX={setPlayerX} x={playerX()} />
        </>
      }
    >
      <NncBoard board={board()} click={handleClick} />
    </Page>
  );
};
