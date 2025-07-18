import { PlayerTypeHuman } from "../../common/scripts/player.ts";
import { sleep } from "../../common/scripts/sleep.ts";
import { CROSS, END_PLAYING, NOUGHT } from "./constants.ts";

import type { PlayerType } from "../../common/scripts/player.ts";
import type { EndType, PlayerColor } from "./constants.ts";
import type { GameController } from "./wasm.ts";

type Parameters = {
  readonly game: GameController;
  readonly players: Players;
  readonly requestInput: () => Promise<number>;
  readonly setBoard: (board: readonly number[]) => void;

  readonly setColor: (color: PlayerColor) => void;
  readonly setEnd: (end: EndType) => void;
};

type Players = {
  readonly [CROSS]: PlayerType;
  readonly [NOUGHT]: PlayerType;
};
type Terminator = () => void;

export const startGame = (parameters: Parameters): Terminator => {
  const { game, players, requestInput, setBoard, setColor, setEnd } = parameters;
  let gameObject = game.init();

  const terminate = (): void => {
    game.deinit(gameObject);
    gameObject = 0;
  };

  const run = async (): Promise<void> => {
    setBoard(game.getBoard(gameObject));
    const color = game.getColor(gameObject);

    if (isHuman(color, players)) {
      const to = await requestInput();
      game.move(gameObject, to);
    } else {
      game.ai(gameObject);
      await sleep(1000);
    }

    setColor(game.getColor(gameObject));
    setBoard(game.getBoard(gameObject));

    const end = game.getWinner(gameObject);
    if (end !== END_PLAYING) {
      setEnd(end);
      terminate();
    }

    if (gameObject !== 0) {
      setCallback(run);
    }
  };

  setCallback(run);

  return terminate;
};

const isHuman = (color: PlayerColor, players: Players): boolean => {
  return players[color] === PlayerTypeHuman;
};

const setCallback = (callback: () => Promise<void> | void): void => {
  setTimeout(() => {
    return void callback();
  }, 0);
};
