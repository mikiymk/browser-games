import { Start } from "@/components/header-buttons/start";
import { PageBody } from "@/components/page/body";
import { PageHeader } from "@/components/page/header";
import { PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import { createUrlQuerySignal } from "@/scripts/use-url-query";
import type { JSXElement } from "solid-js";
import { createGame } from "../game";
import { ShogiBoard } from "./board";
import { GameOverPopUp } from "./game-over-pop-up";
import { PromotionPopUp } from "./promotion-pop-up";
import { ShogiSettings } from "./settings";

export const App = (): JSXElement => {
  const [black, setBlack] = createUrlQuerySignal<PlayerType>("first", PlayerTypeHuman);
  const [white, setWhite] = createUrlQuerySignal<PlayerType>("second", PlayerTypeAi);

  const { board, whiteHands, blackHands, gameOver, promotion, start, handleBoardClick, setGameOver, resolve } =
    createGame(white, black);

  return (
    <>
      <PageHeader
        buttons={
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
      />
      <PageBody>
        <ShogiBoard board={board()} hands={[whiteHands(), blackHands()]} onSquareClick={handleBoardClick} />
      </PageBody>
    </>
  );
};
