import { PlayerTypeHuman } from "../../common/scripts/player.ts";
import { sleep } from "../../common/scripts/sleep.ts";
import { MOVE_TARGET } from "./constants.ts";

import type { MultiPromise } from "../../common/scripts/multi-promise.ts";
import type { PlayerType } from "../../common/scripts/player.ts";
import type { BLACK, Hand, WHITE } from "./constants.ts";
import type { Game, WasmConnect } from "./wasm.ts";

const AI_SLEEP_TIME_MS = 500;
const EmptyBoard: readonly number[] = Array.from({ length: 81 }, () => 0);

type Players = { readonly [BLACK]: PlayerType; readonly [WHITE]: PlayerType };
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
  let game: Game = wasm.init();

  const terminate = (): void => {
    wasm.deinit(game);
    game = { board: 0, game: 0 };
  };

  const run = async (): Promise<void> => {
    setBoard(wasm.board(game));
    setHands(wasm.hands(game));

    const color = wasm.player(game);
    if (isHuman(players, color)) {
      await plyHuman(wasm, game, setMove, setPromotion, humanInput);
    } else {
      wasm.ai(game);
      await sleep(AI_SLEEP_TIME_MS);
    }

    setPlayer(wasm.player(game));
    setBoard(wasm.board(game));
    setMove(EmptyBoard);

    const end = wasm.winner(game);
    if (end !== 0) {
      setWinner(end);
      terminate();
    }

    if (game.game !== 0) {
      setTimeout(() => run(), 0);
    }
  };

  setTimeout(() => run(), 0);

  return terminate;
};

const plyHuman = async (
  wasm: WasmConnect,
  game: Game,
  setMove: (move: readonly number[]) => void,
  setPromotion: (promotion: boolean) => void,
  humanInput: MultiPromise<number>,
): Promise<void> => {
  for (;;) {
    setMove(EmptyBoard);

    // biome-ignore lint/performance/noAwaitInLoops: 入力を待つ
    const from = await humanInput.request();
    if (from >= 100) {
      if (await plyHumanHit(wasm, game, setMove, humanInput, from - 100)) {
        return;
      }
    } else if (await plyHumanMove(wasm, game, setMove, setPromotion, humanInput, from)) {
      return;
    }
  }
};

const plyHumanHit = async (
  wasm: WasmConnect,
  game: Game,
  setMove: (move: readonly number[]) => void,
  humanInput: MultiPromise<number>,
  from: number,
): Promise<boolean> => {
  const hits = wasm.hitPos(game, from);
  if (!hits.includes(MOVE_TARGET)) {
    return false;
  }
  setMove(hits);
  const to = await humanInput.request();
  if (to >= 100) {
    return false;
  }

  if (hits[to] === MOVE_TARGET) {
    wasm.hit(game, from, to);
    return true;
  }

  return false;
};

const plyHumanMove = async (
  wasm: WasmConnect,
  game: Game,
  setMove: (move: readonly number[]) => void,
  setPromotion: (promotion: boolean) => void,
  humanInput: MultiPromise<number>,
  from: number,
): Promise<boolean> => {
  const moves = wasm.movePos(game, from);

  if (!moves.includes(MOVE_TARGET)) {
    return false;
  }

  setMove(moves);

  const to = await humanInput.request();
  if (to > 99) {
    return false;
  }

  if (moves[to] === MOVE_TARGET) {
    if (wasm.move(game, from, to)) {
      setPromotion(true);
      const isPromote = await askPromote(humanInput);
      setPromotion(false);

      if (isPromote) {
        wasm.promote(game, to);
      }
    }

    return true;
  }
  return false;
};
