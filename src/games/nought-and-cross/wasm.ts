import { mergeBoards, transBoard } from "../english-draughts/boards";
import { BLACK, BLACK_NUMBER, WHITE, WHITE_NUMBER } from "./constants";
import type { PlayerColor } from "./constants";

export type GameObject = 0 | (number & { readonly __unique: "Wasm pointer of Game object" });

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

type GameController = {
  init: () => GameObject;
  deinit: (g: GameObject) => void;
  getColor: (g: GameObject) => PlayerColor;
  getWinner: (g: GameObject) => PlayerColor | undefined;
  getBoard: (g: GameObject) => readonly number[];
  move: (g: GameObject, position: number) => void;
  ai: (g: GameObject) => void;
};

export const getWasm = async (): Promise<GameController> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/nought-and-cross.wasm`));
  const exports = wasm.instance.exports as WasmExports;

  return {
    init: exports.init,
    deinit: exports.deinit,

    getColor(game): PlayerColor {
      return exports.getCurrentPlayer(game) === WHITE_NUMBER ? WHITE : BLACK;
    },

    getWinner(game): PlayerColor | undefined {
      if (!exports.isWin(game)) {
        return undefined;
      }

      return exports.getWinner(game) === WHITE_NUMBER ? WHITE : BLACK;
    },

    getBoard(game): readonly number[] {
      const whiteBoard = transBoard(3, 3, exports.getBoard(game, WHITE_NUMBER), WHITE_NUMBER);
      const blackBoard = transBoard(3, 3, exports.getBoard(game, BLACK_NUMBER), BLACK_NUMBER);

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
