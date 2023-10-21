import { For, createResource, createSignal } from "solid-js";

import { cellStyle } from "@/styles/knight-tour.css";
import { boardStyle, checkedRadioStyle, radioStyle } from "@/styles/reversi.css";
import { MultiPromise } from "@/scripts/multi-promise";

import { AiPlayer, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, HumanPlayer } from "./const";
import { getReversiWasm } from "./get-wasm";
import { CellImage } from "./cell-image";
import { gameLoop } from "./game-loop";

export const App = () => {
  const [board, setBoard] = createSignal(Array.from({ length: 64 }, () => CellEmpty));
  const [blackPlayer, setBlackPlayer] = createSignal(HumanPlayer);
  const [whitePlayer, setWhitePlayer] = createSignal(AiPlayer);
  const [wasm] = createResource(getReversiWasm);
  let terminateGame: (() => void) | undefined;

  // eslint-disable-next-line unicorn/consistent-function-scoping
  let resolve = (_: number) => {
    // empty
  };
  // eslint-disable-next-line unicorn/consistent-function-scoping
  let reject = () => {
    // empty
  };
  const humanInput = new MultiPromise<number>((rs, rj) => {
    resolve = rs;
    reject = rj;
  });

  const handleStart = () => {
    const exports = wasm();
    if (exports === undefined) return;
    terminateGame?.();
    reject();

    terminateGame = gameLoop(exports, setBoard, humanInput, { black: blackPlayer(), white: whitePlayer() });
  };

  const handleClick = (square: number, index: number) => {
    if (square !== CellCanMoveBlack && square !== CellCanMoveWhite) {
      return;
    }

    resolve(index);
  };

  return (
    <>
      <div class={boardStyle}>
        <For each={board()}>
          {(square, index) => {
            return (
              <span class={cellStyle}>
                <button
                  type="button"
                  onClick={() => {
                    handleClick(square, index());
                  }}
                >
                  <CellImage square={square} />
                </button>
              </span>
            );
          }}
        </For>
      </div>

      <div>
        <h2>Settings</h2>

        <button type="button" onClick={handleStart}>
          Start
        </button>

        <div>
          Black:
          <label
            classList={{
              [radioStyle]: true,
              [checkedRadioStyle]: blackPlayer() === HumanPlayer,
            }}
          >
            Player
            <input
              type="radio"
              name="black-player"
              checked={blackPlayer() === HumanPlayer}
              onClick={() => {
                setBlackPlayer(HumanPlayer);
              }}
            />
          </label>
          <label
            classList={{
              [radioStyle]: true,
              [checkedRadioStyle]: blackPlayer() === AiPlayer,
            }}
          >
            CPU
            <input
              type="radio"
              name="black-player"
              checked={blackPlayer() === AiPlayer}
              onClick={() => {
                setBlackPlayer(AiPlayer);
              }}
            />
          </label>
        </div>
        <div>
          White:
          <label
            classList={{
              [radioStyle]: true,
              [checkedRadioStyle]: whitePlayer() === HumanPlayer,
            }}
          >
            Player
            <input
              type="radio"
              name="white-player"
              checked={whitePlayer() === HumanPlayer}
              onClick={() => {
                setWhitePlayer(HumanPlayer);
              }}
            />
          </label>
          <label
            classList={{
              [radioStyle]: true,
              [checkedRadioStyle]: whitePlayer() === AiPlayer,
            }}
          >
            CPU
            <input
              type="radio"
              name="white-player"
              checked={whitePlayer() === AiPlayer}
              onClick={() => {
                setWhitePlayer(AiPlayer);
              }}
            />
          </label>
        </div>
      </div>
    </>
  );
};
