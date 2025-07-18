import { Start } from "../../../common/components/header-buttons/start.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { PlayerTypeAi, PlayerTypeHuman } from "../../../common/scripts/player.ts";
import { createUrlQuerySignal } from "../../../common/scripts/use-url-query.ts";
import { createShogiGame } from "../game.ts";
import { ShogiBoard } from "./board.tsx";
import { GameOverPopUp } from "./game-over-pop-up.tsx";
import { PromotionPopUp } from "./promotion-pop-up.tsx";
import { ShogiSettings } from "./settings.tsx";

import type { JSXElement } from "solid-js";

import type { PlayerType } from "../../../common/scripts/player.ts";

export const App = (): JSXElement => {
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("first", PlayerTypeHuman);
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("second", PlayerTypeAi);

  const { blackHands, board, gameOver, handleBoardClick, promotion, resolve, setGameOver, start, whiteHands } =
    createShogiGame(white, black);

  return (
    <Page
      header={
        <>
          <Start start={start} />
          <ShogiSettings black={black()} setBlack={setBlack} setWhite={setWhite} white={white()} />
          <GameOverPopUp gameOver={gameOver() !== 0} set={setGameOver} />
          <PromotionPopUp
            promotion={promotion()}
            resolve={(value) => {
              resolve(value);
            }}
          />
        </>
      }
    >
      <ShogiBoard board={board()} handleSquareClick={handleBoardClick} hands={[whiteHands(), blackHands()]} />
    </Page>
  );
};
