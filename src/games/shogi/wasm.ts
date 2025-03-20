import type { Hand } from "./constants.ts";

type GamePtr = 0 | (number & { readonly __uniqueShogiGame: "Wasm pointer of Game struct" });
type BoardArray = 0 | (number & { readonly __uniqueShogiBoardArray: "Wasm pointer of Game struct" });
export type Game = { readonly game: GamePtr; readonly board: BoardArray };

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

export type WasmConnect = {
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

export const getWasm = async (): Promise<WasmConnect> => {
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
