import { COLOR_BLACK, COLOR_NONE, COLOR_WHITE } from "./constants";
import type { GameController, GameObject, PlayerColor } from "./game-loop";

type WasmExports = {
  init: () => GameObject;
  deinit: (g: GameObject) => void;
  getBoard: (g: GameObject, color: number) => bigint;
  getColor: (g: GameObject) => number;
  getMove: (g: GameObject, index: number) => bigint;
  move: (g: GameObject, from: number, to: number) => boolean;
  ai: (g: GameObject) => void;
};

export const getWasm = async (): Promise<GameController> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/english-draughts.wasm`));

  const exports = wasm.instance.exports as WasmExports;

  return {
    init: exports.init,
    deinit: exports.deinit,
    getColor: (game): PlayerColor => (exports.getColor(game) === COLOR_WHITE ? "white" : "black"),

    getBoard: (game): readonly number[] => {
      const white = exports.getBoard(game, COLOR_WHITE);
      const black = exports.getBoard(game, COLOR_BLACK);

      const board = Array.from({ length: 64 }, (_, index) => {
        if (white & (1n << BigInt(index))) {
          return COLOR_WHITE;
        }
        if (black & (1n << BigInt(index))) {
          return COLOR_BLACK;
        }

        return COLOR_NONE;
      });

      return board;
    },
  };
};
