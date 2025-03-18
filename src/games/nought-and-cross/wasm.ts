import { mergeBoards, transBoard } from "../english-draughts/boards";
import { CROSS, CROSS_WASM, NOUGHT, NOUGHT_WASM } from "./constants";
import type { PlayerColor } from "./constants";

type GameObject = 0 | (number & { readonly __unique: "Wasm pointer of Game object" });

type WasmExports = {
  init: () => GameObject;
  deinit: (g: GameObject) => void;
  getBoard: (g: GameObject, color: number) => number;
  getCurrentPlayer: (g: GameObject) => number;
  isWin: (g: GameObject) => boolean;
  getWinner: (g: GameObject) => number;
  move: (g: GameObject, to: number) => void;
  ai: (g: GameObject) => void;
} & {
  memory: WebAssembly.Memory;
};

export type GameController = {
  readonly init: () => GameObject;
  readonly deinit: (g: GameObject) => void;
  readonly getColor: (g: GameObject) => PlayerColor;
  readonly getWinner: (g: GameObject) => PlayerColor | undefined;
  readonly getBoard: (g: GameObject) => readonly number[];
  readonly move: (g: GameObject, position: number) => void;
  readonly ai: (g: GameObject) => void;
};

export const getWasm = async (): Promise<GameController> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/nought-and-cross.wasm`));
  const exports = wasm.instance.exports as WasmExports;

  return {
    init: exports.init,
    deinit: exports.deinit,

    getColor(game): PlayerColor {
      return exports.getCurrentPlayer(game) === NOUGHT_WASM ? NOUGHT : CROSS;
    },

    getWinner(game): PlayerColor | undefined {
      if (!exports.isWin(game)) {
        return undefined;
      }

      return exports.getWinner(game) === NOUGHT_WASM ? NOUGHT : CROSS;
    },

    getBoard(game): readonly number[] {
      const whiteBoard = transBoard(3, 3, exports.getBoard(game, NOUGHT_WASM), NOUGHT);
      const blackBoard = transBoard(3, 3, exports.getBoard(game, CROSS_WASM), CROSS);

      return mergeBoards(whiteBoard, blackBoard);
    },

    move(game, to): void {
      exports.move(game, to);
    },

    ai(game): void {
      exports.ai(game);
    },
  };
};
