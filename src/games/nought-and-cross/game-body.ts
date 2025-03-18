import { PlayerTypeHuman } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import { sleep } from "@/scripts/sleep";
import { BLACK, WHITE } from "./constants";
import type { EndType, PlayerColor } from "./constants";
import type { GameController } from "./wasm";

type Players = {
  readonly [WHITE]: PlayerType;
  readonly [BLACK]: PlayerType;
};

type Parameters = {
  readonly game: GameController;
  readonly setBoard: (board: readonly number[]) => void;
  readonly setColor: (color: PlayerColor) => void;
  readonly setEnd: (end: EndType) => void;

  readonly players: Players;
  readonly requestInput: () => Promise<number>;
};
type Terminator = () => void;

export const startGame = (parameters: Parameters): Terminator => {
  const { game, setBoard, setColor, setEnd, players, requestInput } = parameters;
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
    if (end !== undefined) {
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
