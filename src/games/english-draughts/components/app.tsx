import { Board } from "../../../common/components/game-board/board.tsx";
import { PlayerSetting, Settings } from "../../../common/components/header-buttons/settings.tsx";
import { Start } from "../../../common/components/header-buttons/start.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { chessBoard } from "../../../images/image-sources.ts";
import { createEnglishDraughtsGame } from "../game.ts";
import { UsePiece } from "./define.tsx";

import type { JSXElement } from "solid-js";

export const App = (): JSXElement => {
  const { black, boardNumber, handleClick, handleStart, setBlack, setWhite, white } = createEnglishDraughtsGame();

  return (
    <Page
      header={
        <>
          <Start start={handleStart} />
          <Settings>
            <PlayerSetting black={black()} setBlack={setBlack} setWhite={setWhite} white={white()} />
          </Settings>
        </>
      }
    >
      <Board background={chessBoard} data={boardNumber()} height={8} onClick={handleClick} width={8}>
        {(square, _, x, y) => <UsePiece piece={square} x={x} y={y} />}
      </Board>
    </Page>
  );
};
