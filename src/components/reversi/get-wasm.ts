import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, CellWhite } from "./const";

type BoardPtr = (number & { __unique: "Wasm pointer of Board struct" }) | 0;
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
  init: () => BoardPtr;
  deinit: (bp: BoardPtr) => void;
  getBoard: (bp: BoardPtr, showValidMoves: boolean) => number[];
  isBlack: (bp: BoardPtr) => boolean;
  move: (bp: BoardPtr, place: number) => void;
  isEnd: (bp: BoardPtr) => boolean;
  ai: (bp: BoardPtr) => number;
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
      } else if (n & white) {
        return CellWhite;
      } else if (n & validMoves) {
        return isBlack ? CellCanMoveBlack : CellCanMoveWhite;
      } else {
        return CellEmpty;
      }
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
