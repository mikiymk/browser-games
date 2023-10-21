import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellEmpty, CellWhite } from "./const";

export type BoardPtr = number & { __unique: "Wasm pointer of Board struct" };
export type ReversiWasm = {
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

export const getReversiWasm = async () => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/reversi.wasm`), {
    env: { random: Math.random },
  });

  const exports = wasm.instance.exports as ReversiWasm;

  const getBoard = (bp: BoardPtr): number[] => {
    const black = exports.getBlack(bp);
    const white = exports.getWhite(bp);

    const isBlack = exports.isNextBlack(bp);
    const validMoves = exports.getValidMoves(bp);

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
    getBoard,
    move: exports.move,
  };
};
