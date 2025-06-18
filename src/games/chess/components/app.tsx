import type { JSXElement } from "solid-js";

import { PlayerSetting, Settings } from "../../../common/components/header-buttons/settings.tsx";
import { Start } from "../../../common/components/header-buttons/start.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { createChessGame } from "../game.ts";
import { ChessBoard } from "./board.tsx";
import { Status } from "./status.tsx";

export const App = (): JSXElement => {
  const { black, board, color, end, handleClick, setBlack, setWhite, start, white } = createChessGame();

  return (
    <Page
      header={
        <>
          <Status color={color()} end={end()} />
          <Start start={start} />
          <Settings>
            <PlayerSetting black={black()} setBlack={setBlack} setWhite={setWhite} white={white()} />
          </Settings>
        </>
      }
    >
      <ChessBoard board={board()} handleClick={handleClick} />
    </Page>
  );
};
