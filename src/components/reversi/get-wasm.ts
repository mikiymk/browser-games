import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, CellWhite } from "./const";

type BoardPtr = 0 | (number & { readonly __unique: "Wasm pointer of Board struct" });
type ReversiWasm = WebAssembly.Exports & {
  init: () => BoardPtr;
  deinit: (bp: BoardPtr) => void;
  getBlack: (bp: BoardPtr) => bigint;
  getWhite: (bp: BoardPtr) => bigint;
  isNextBlack: (bp: BoardPtr) => boolean;
  isGameEnd: (bp: BoardPtr) => boolean;
  move: (bp: BoardPtr, place: number) => void;
  getValidMoves: (bp: BoardPtr) => bigint;
  getAiMove: (bp: BoardPtr) => number;
};

export type ReversiWasmConnect = {
  readonly init: () => BoardPtr;
  readonly deinit: (bp: BoardPtr) => void;
  readonly getBoard: (bp: BoardPtr, showValidMoves: boolean) => readonly number[];
  readonly isBlack: (bp: BoardPtr) => boolean;
  readonly move: (bp: BoardPtr, place: number) => void;
  readonly isEnd: (bp: BoardPtr) => boolean;
  readonly ai: (bp: BoardPtr) => number;
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
    init: exports.init,
    deinit: exports.deinit,
    move: exports.move,
    isBlack: exports.isNextBlack,
    isEnd: exports.isGameEnd,
    ai: exports.getAiMove,

    getBoard,
  };
};
