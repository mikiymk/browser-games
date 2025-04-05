import type { MultiPromise } from "../../scripts/multi-promise.ts";
import type { PlayerType } from "../../scripts/player.ts";
import { PlayerTypeHuman } from "../../scripts/player.ts";
import { sleep } from "../../scripts/sleep.ts";
import type { BLACK, Hand, WHITE } from "./constants.ts";
import { MOVE_TARGET } from "./constants.ts";
import type { Game, WasmConnect } from "./wasm.ts";

const AI_SLEEP_TIME_MS = 500;
const EmptyBoard: readonly number[] = Array.from({ length: 81 }, () => 0);

type Players = { readonly [WHITE]: PlayerType; readonly [BLACK]: PlayerType };
const isHuman = (players: Players, color: number): boolean => {
  return players[color as typeof BLACK | typeof WHITE] === PlayerTypeHuman;
};

const askPromote = async (humanInput: MultiPromise<number>): Promise<boolean> => {
  return (await humanInput.request()) === 1;
};

export const gameLoop = (
  wasm: WasmConnect,
  setPlayer: (player: number) => void,
  setBoard: (board: readonly number[]) => void,
  setWinner: (winner: number) => void,
  setMove: (move: readonly number[]) => void,
  setHands: (hands: readonly [Hand, Hand]) => void,
  setPromotion: (promotion: boolean) => void,
  humanInput: MultiPromise<number>,
  players: Players,
): (() => void) => {
  const {
    init,
    deinit,

    board,
    hands,
    player,
    winner,
    movePos,
    hitPos,

    move,
    hit,
    promote,

    ai,
  } = wasm;

  let game: Game = init();

  const terminate = (): void => {
    deinit(game);
    game = { game: 0, board: 0 };
  };

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: 長い関数
  const ply = async (color: number): Promise<void> => {
    if (isHuman(players, color)) {
      for (;;) {
        setMove(EmptyBoard);

        const from = await humanInput.request();
        if (from > 99) {
          const hits = hitPos(game, from - 100);
          if (!hits.includes(MOVE_TARGET)) {
            continue;
          }
          setMove(hits);
          const to = await humanInput.request();
          if (to > 99) {
            continue;
          }

          if (hits[to] === MOVE_TARGET) {
            hit(game, from - 100, to);
            return;
          }

          continue;
        }

        const moves = movePos(game, from);

        if (!moves.includes(MOVE_TARGET)) {
          continue;
        }

        setMove(moves);

        const to = await humanInput.request();
        if (to > 99) {
          continue;
        }

        if (moves[to] === MOVE_TARGET) {
          if (move(game, from, to)) {
            setPromotion(true);
            const isPromote = await askPromote(humanInput);
            setPromotion(false);

            if (isPromote) {
              promote(game, to);
            }
          }

          return;
        }
      }
    } else {
      ai(game);

      await sleep(AI_SLEEP_TIME_MS);
    }
  };

  const run = async (): Promise<void> => {
    setBoard(board(game));
    setHands(hands(game));
    const color = player(game);

    await ply(color);

    setPlayer(player(game));
    setBoard(board(game));
    setMove(EmptyBoard);

    const end = winner(game);
    if (end !== 0) {
      setWinner(end);
      terminate();
    }

    if (game.game !== 0) {
      setTimeout(() => {
        void run();
      }, 0);
    }
  };

  setTimeout(() => {
    void run();
  }, 0);

  return terminate;
};
