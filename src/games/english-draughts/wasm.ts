import { mergeBoards, transBoard } from "./boards";
import { COLOR_KING_BLACK, COLOR_KING_WHITE, COLOR_PAWN_BLACK, COLOR_PAWN_WHITE, MOVE_TARGET } from "./constants";
import type { GameController, GameObject, PlayerColor } from "./game-loop";

type WasmExports = {
  init: () => GameObject;
  deinit: (g: GameObject) => void;
  getBoard: (g: GameObject, color: number) => bigint;
  getColor: (g: GameObject) => number;
  getMove: (g: GameObject, index: number) => bigint;
  move: (g: GameObject, from: number, to: number) => boolean;
  ai: (g: GameObject) => void;
} & {
  memory: WebAssembly.Memory;
};

export const getWasm = async (): Promise<GameController> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/english-draughts.wasm`));

  const exports = wasm.instance.exports as WasmExports;

  return {
    init: exports.init,
    deinit: exports.deinit,

    getColor(game): PlayerColor {
      return exports.getColor(game) === COLOR_PAWN_WHITE ? "white" : "black";
    },

    getEnd(_game): number {
      return 0;
    },

    getBoard(game): readonly number[] {
      const whitePawn = transBoard(8, 8, exports.getBoard(game, COLOR_PAWN_WHITE), COLOR_PAWN_WHITE);
      const whiteKing = transBoard(8, 8, exports.getBoard(game, COLOR_KING_WHITE), COLOR_KING_WHITE);
      const blackPawn = transBoard(8, 8, exports.getBoard(game, COLOR_PAWN_BLACK), COLOR_PAWN_BLACK);
      const blackKing = transBoard(8, 8, exports.getBoard(game, COLOR_KING_BLACK), COLOR_KING_BLACK);

      return mergeBoards(whitePawn, whiteKing, blackPawn, blackKing);
    },

    getMove(game, position): readonly number[] {
      return transBoard(8, 8, exports.getMove(game, position), MOVE_TARGET);
    },

    move(game, from, to): boolean {
      return exports.move(game, from, to);
    },

    ai(game): void {
      exports.ai(game);
    },
  };
};
