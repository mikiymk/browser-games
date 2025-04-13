import type { Hand } from "./constants.ts";

export type Game = { readonly board: BoardArray; readonly game: GamePtr };
export type WasmConnect = {
  readonly ai: (g: Game) => void;
  readonly board: (g: Game) => readonly number[];

  readonly deinit: (g: Game) => void;
  readonly hands: (g: Game) => readonly [Hand, Hand];
  readonly hit: (g: Game, piece: number, position: number) => void;
  readonly hitPos: (g: Game, piece: number) => readonly number[];
  readonly init: () => Game;
  readonly move: (g: Game, from: number, to: number) => boolean;

  readonly movePos: (g: Game, from: number) => readonly number[];
  readonly player: (g: Game) => number;
  readonly promote: (g: Game, position: number) => void;

  readonly winner: (g: Game) => number;
};
type BoardArray = 0 | (number & { readonly __uniqueShogiBoardArray: "Wasm pointer of Game struct" });

type GamePtr = 0 | (number & { readonly __uniqueShogiGame: "Wasm pointer of Game struct" });

type WasmExports = {
  deinit: (g: GamePtr) => void;
  deinitBoard: (b: BoardArray) => void;
  hands: (g: GamePtr, b: BoardArray) => void;
  hit: (g: GamePtr, piece: number, position: number) => void;
  hitPos: (g: GamePtr, b: BoardArray, piece: number) => void;
  init: () => GamePtr;
  initBoard: () => BoardArray;
  memory: WebAssembly.Memory;
  move: (g: GamePtr, from: number, to: number) => boolean;
  moveAi: (g: GamePtr) => void;
  movePos: (g: GamePtr, b: BoardArray, from: number) => void;
  player: (g: GamePtr) => number;
  promote: (g: GamePtr, position: number) => void;
  setBoard: (g: GamePtr, b: BoardArray) => void;

  winner: (g: GamePtr) => number;
};

export const getWasm = async (): Promise<WasmConnect> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/shogi.wasm`), {});

  const exports = wasm.instance.exports as WasmExports;

  const getBoard = (board: BoardArray, length: number): readonly number[] => {
    // UInt8ArrayからArrayに変換する
    // eslint-disable-next-line unicorn/no-useless-spread -- Uint8ArrayからArrayへ変換
    return [...new Uint8Array(exports.memory.buffer).slice(board, board + length)];
  };

  return {
    ai: ({ game }: Game): void => {
      exports.moveAi(game);
    },
    board: ({ board, game }: Game): readonly number[] => {
      exports.setBoard(game, board);

      return getBoard(board, 81);
    },

    deinit: (game: Game): void => {
      exports.deinitBoard(game.board);
      exports.deinit(game.game);
    },
    hands: ({ board, game }: Game): readonly [Hand, Hand] => {
      exports.hands(game, board);

      const h = getBoard(board, 16);

      return [h.slice(0, 8) as unknown as Hand, h.slice(8) as unknown as Hand];
    },
    hit: ({ game }: Game, piece: number, position: number): void => {
      exports.hit(game, piece, position);
    },
    hitPos: ({ board, game }: Game, piece: number): readonly number[] => {
      exports.hitPos(game, board, piece);

      return getBoard(board, 81);
    },
    init: (): Game => {
      const game = exports.init();
      const board = exports.initBoard();

      return { board, game };
    },
    move: ({ game }: Game, from: number, to: number): boolean => exports.move(game, from, to),

    movePos: ({ board, game }: Game, from: number): readonly number[] => {
      exports.movePos(game, board, from);

      return getBoard(board, 81);
    },
    player: ({ game }: Game): number => exports.player(game),
    promote: ({ game }: Game, position: number): void => {
      exports.promote(game, position);
    },

    winner: ({ game }: Game): number => exports.winner(game),
  };
};
