import type { EndType, PlayerColor } from "./constants.ts";

import { mergeBoards, transBoard } from "../english-draughts/boards.ts";
import { CROSS, CROSS_WASM, NOUGHT, NOUGHT_WASM } from "./constants.ts";

export type GameController = {
  readonly ai: (g: GameObject) => void;
  readonly deinit: (g: GameObject) => void;
  readonly getBoard: (g: GameObject) => readonly number[];
  readonly getColor: (g: GameObject) => PlayerColor;
  readonly getWinner: (g: GameObject) => EndType;
  readonly init: () => GameObject;
  readonly move: (g: GameObject, position: number) => void;
};

type GameObject = 0 | (number & { readonly __unique: "Wasm pointer of Game object" });

type WasmExports = {
  ai: (g: GameObject) => void;
  deinit: (g: GameObject) => void;
  getBoard: (g: GameObject, color: number) => number;
  getCurrentPlayer: (g: GameObject) => number;
  getWinner: (g: GameObject) => number;
  init: () => GameObject;
  move: (g: GameObject, to: number) => void;
} & {
  memory: WebAssembly.Memory;
};

export const getWasm = async (): Promise<GameController> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/nought-and-cross.wasm`));
  const exports = wasm.instance.exports as WasmExports;

  return {
    ai(game): void {
      exports.ai(game);
    },
    deinit: exports.deinit,

    getBoard(game): readonly number[] {
      const whiteBoard = transBoard(3, 3, exports.getBoard(game, NOUGHT_WASM), NOUGHT);
      const blackBoard = transBoard(3, 3, exports.getBoard(game, CROSS_WASM), CROSS);

      return mergeBoards(whiteBoard, blackBoard);
    },

    getColor(game): PlayerColor {
      return exports.getCurrentPlayer(game) === NOUGHT_WASM ? NOUGHT : CROSS;
    },

    getWinner(game): EndType {
      return exports.getWinner(game) as EndType;
    },

    init: exports.init,

    move(game, to): void {
      exports.move(game, to);
    },
  };
};
