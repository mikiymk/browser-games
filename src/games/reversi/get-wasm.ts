import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, CellWhite } from "./constants.ts";

export type ReversiWasmConnect = {
  readonly ai: (bp: BoardPtr) => number;
  readonly deinit: (bp: BoardPtr) => void;
  readonly getBoard: (bp: BoardPtr, showValidMoves: boolean) => readonly number[];
  readonly init: () => BoardPtr;
  readonly isBlack: (bp: BoardPtr) => boolean;
  readonly isEnd: (bp: BoardPtr) => boolean;
  readonly move: (bp: BoardPtr, place: number) => void;
};
type BoardPtr = 0 | (number & { readonly __unique: "Wasm pointer of Board struct" });

type ReversiWasm = WebAssembly.Exports & {
  deinit: (bp: BoardPtr) => void;
  getAiMove: (bp: BoardPtr) => number;
  getBlack: (bp: BoardPtr) => bigint;
  getValidMoves: (bp: BoardPtr) => bigint;
  getWhite: (bp: BoardPtr) => bigint;
  init: () => BoardPtr;
  isGameEnd: (bp: BoardPtr) => boolean;
  isNextBlack: (bp: BoardPtr) => boolean;
  move: (bp: BoardPtr, place: number) => void;
};

export const getReversiWasm = async (): Promise<ReversiWasmConnect> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/reversi.wasm`));

  const exports = wasm.instance.exports as ReversiWasm;

  const getBoard = (bp: BoardPtr, showValidMoves: boolean): number[] => {
    const black = exports.getBlack(bp);
    const white = exports.getWhite(bp);

    const isBlack = exports.isNextBlack(bp);
    const validMoves = showValidMoves ? exports.getValidMoves(bp) : 0n;

    return Array.from({ length: 64 }, (_, index) => 1n << BigInt(index)).map((n) => {
      if (n & black) {
        return CellBlack;
      }
      if (n & white) {
        return CellWhite;
      }
      if (n & validMoves) {
        return isBlack ? CellCanMoveBlack : CellCanMoveWhite;
      }

      return CellEmpty;
    });
  };

  return {
    ai: exports.getAiMove,
    deinit: exports.deinit,
    getBoard,
    init: exports.init,
    isBlack: exports.isNextBlack,
    isEnd: exports.isGameEnd,

    move: exports.move,
  };
};
