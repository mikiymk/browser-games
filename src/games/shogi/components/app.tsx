import type { JSXElement } from "solid-js";
import { Start } from "../../../components/header-buttons/start.tsx";
import { PlayerTypeAi, PlayerTypeHuman } from "../../../scripts/player.ts";
import type { PlayerType } from "../../../scripts/player.ts";
import { createUrlQuerySignal } from "../../../scripts/use-url-query.ts";
import { createGame } from "../game.ts";
import { ShogiBoard } from "./board.tsx";
import { GameOverPopUp } from "./game-over-pop-up.tsx";
import { PromotionPopUp } from "./promotion-pop-up.tsx";
import { ShogiSettings } from "./settings.tsx";
import { Page } from "../../../components/page/page.tsx";

export const App = (): JSXElement => {
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("first", PlayerTypeHuman);
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("second", PlayerTypeAi);

  const { board, whiteHands, blackHands, gameOver, promotion, start, handleBoardClick, setGameOver, resolve } =
    createGame(white, black);

  return (
    <Page
      header={
        <>
          <Start start={start} />
          <ShogiSettings white={white()} black={black()} setWhite={setWhite} setBlack={setBlack} />
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
      <ShogiBoard board={board()} hands={[whiteHands(), blackHands()]} onSquareClick={handleBoardClick} />
    </Page>
  );
};
