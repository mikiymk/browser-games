import { PlayerTypeHuman } from "../../common/scripts/player.ts";
import { sleep } from "../../common/scripts/sleep.ts";
import { MOVE_TARGET, NotEnd } from "./constants.ts";

import type { PlayerType } from "../../common/scripts/player.ts";

export type GameController = {
  readonly ai: (gameObject: GameObject) => void;
  readonly deinit: (gameObject: GameObject) => void;

  readonly getBoard: (gameObject: GameObject) => readonly number[];
  readonly getColor: (gameObject: GameObject) => PlayerColor;
  readonly getEnd: (gameObject: GameObject) => number;
  readonly getMove: (gameObject: GameObject, position: number) => readonly number[];

  readonly init: () => GameObject;
  readonly move: (gameObject: GameObject, from: number, to: number) => boolean;
};

export type GameObject = 0 | (number & { readonly __unique: "Wasm pointer of Board struct" });
export type PlayerColor = "black" | "white";

type Players = {
  readonly black: PlayerType;
  readonly white: PlayerType;
};

type ViewController = {
  readonly players: Players;
  readonly requestInput: () => Promise<number>;
  readonly setBoard: (board: readonly number[]) => void;
  readonly setColor: (color: PlayerColor) => void;

  readonly setEnd: (end: number) => void;
  readonly setMove: (board: readonly number[]) => void;
};

const isHuman = (color: PlayerColor, players: Players): boolean => {
  return players[color] === PlayerTypeHuman;
};

const AI_SLEEP_TIME_MS = 1000;

export const gameLoop = (game: GameController, view: ViewController): (() => void) => {
  let gameObject: GameObject = game.init();

  const terminate = (): void => {
    game.deinit(gameObject);
    gameObject = 0;
  };

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  const run = async (): Promise<void> => {
    view.setBoard(game.getBoard(gameObject));
    const color = game.getColor(gameObject);

    if (isHuman(color, view.players)) {
      let from: number;
      let to: number;

      for (;;) {
        view.setMove([]);

        from = await view.requestInput();

        const moves = game.getMove(gameObject, from);

        if (!moves.includes(MOVE_TARGET)) {
          continue;
        }

        view.setMove(moves);

        to = await view.requestInput();

        if (moves[to] === MOVE_TARGET) {
          break;
        }
      }

      game.move(gameObject, from, to);
    } else {
      game.ai(gameObject);

      await sleep(AI_SLEEP_TIME_MS);
    }

    view.setColor(game.getColor(gameObject));
    view.setBoard(game.getBoard(gameObject));
    view.setMove([]);

    const end = game.getEnd(gameObject);
    if (end !== NotEnd) {
      view.setEnd(end);
      terminate();
    }

    if (gameObject !== 0) {
      setTimeout(() => {
        return void run();
      }, 0);
    }
  };

  setTimeout(() => {
    return void run();
  }, 0);

  return terminate;
};
