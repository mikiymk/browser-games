import type { MultiPromise } from "@/scripts/multi-promise";
import type { PlayerType } from "@/scripts/player";
import { PlayerTypeHuman } from "@/scripts/player";
import { sleep } from "@/scripts/sleep";
import type { BLACK, Hand, WHITE } from "./constants";
import { MOVE_TARGET } from "./constants";

type GamePtr = 0 | (number & { readonly __uniqueShogiGame: "Wasm pointer of Game struct" });
type BoardArray = 0 | (number & { readonly __uniqueShogiBoardArray: "Wasm pointer of Game struct" });
type Game = { readonly game: GamePtr; readonly board: BoardArray };

type WasmExports = {
  init: () => GamePtr;
  deinit: (g: GamePtr) => void;
  initBoard: () => BoardArray;
  deinitBoard: (b: BoardArray) => void;
  setBoard: (g: GamePtr, b: BoardArray) => void;
  player: (g: GamePtr) => number;
  winner: (g: GamePtr) => number;
  hands: (g: GamePtr, b: BoardArray) => void;
  movePos: (g: GamePtr, b: BoardArray, from: number) => void;
  hitPos: (g: GamePtr, b: BoardArray, piece: number) => void;
  move: (g: GamePtr, from: number, to: number) => boolean;
  hit: (g: GamePtr, piece: number, position: number) => void;
  promote: (g: GamePtr, position: number) => void;
  moveAi: (g: GamePtr) => void;

  memory: WebAssembly.Memory;
};

type WasmConnect = {
  readonly init: () => Game;
  readonly deinit: (g: Game) => void;

  readonly board: (g: Game) => readonly number[];
  readonly hands: (g: Game) => readonly [Hand, Hand];
  readonly player: (g: Game) => number;
  readonly winner: (g: Game) => number;
  readonly movePos: (g: Game, from: number) => readonly number[];
  readonly hitPos: (g: Game, piece: number) => readonly number[];

  readonly move: (g: Game, from: number, to: number) => boolean;
  readonly hit: (g: Game, piece: number, position: number) => void;
  readonly promote: (g: Game, position: number) => void;

  readonly ai: (g: Game) => void;
};

const AI_SLEEP_TIME_MS = 500;
const EmptyBoard: readonly number[] = Array.from({ length: 81 }, () => 0);

const getWasm = async (): Promise<WasmConnect> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/shogi.wasm`), {});

  const exports = wasm.instance.exports as WasmExports;

  const getBoard = (board: BoardArray, length: number): readonly number[] => {
    // UInt8ArrayからArrayに変換する
    // eslint-disable-next-line unicorn/no-useless-spread -- Uint8ArrayからArrayへ変換
    return [...new Uint8Array(exports.memory.buffer).slice(board, board + length)];
  };

  return {
    init: (): Game => {
      const game = exports.init();
      const board = exports.initBoard();

      return { game, board };
    },
    deinit: (game: Game): void => {
      exports.deinitBoard(game.board);
      exports.deinit(game.game);
    },

    board: ({ game, board }: Game): readonly number[] => {
      exports.setBoard(game, board);

      return getBoard(board, 81);
    },
    hands: ({ game, board }: Game): readonly [Hand, Hand] => {
      exports.hands(game, board);

      const h = getBoard(board, 16);

      return [h.slice(0, 8) as unknown as Hand, h.slice(8) as unknown as Hand];
    },
    player: ({ game }: Game): number => exports.player(game),
    winner: ({ game }: Game): number => exports.winner(game),
    movePos: ({ game, board }: Game, from: number): readonly number[] => {
      exports.movePos(game, board, from);

      return getBoard(board, 81);
    },
    hitPos: ({ game, board }: Game, piece: number): readonly number[] => {
      exports.hitPos(game, board, piece);

      return getBoard(board, 81);
    },

    move: ({ game }: Game, from: number, to: number): boolean => exports.move(game, from, to),
    hit: ({ game }: Game, piece: number, position: number): void => {
      exports.hit(game, piece, position);
    },
    promote: ({ game }: Game, position: number): void => {
      exports.promote(game, position);
    },

    ai: ({ game }: Game): void => {
      exports.moveAi(game);
    },
  };
};

type Players = { readonly [WHITE]: PlayerType; readonly [BLACK]: PlayerType };
const isHuman = (players: Players, color: number): boolean => {
  return players[color as typeof BLACK | typeof WHITE] === PlayerTypeHuman;
};

const askPromote = async (humanInput: MultiPromise<number>): Promise<boolean> => {
  return (await humanInput.request()) === 1;
};

const gameLoop = (
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

export { getWasm, gameLoop };
