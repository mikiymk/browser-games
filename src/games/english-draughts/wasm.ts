import { mergeBoards, transBoard } from "./boards";
import { COLOR_BLACK, COLOR_WHITE, MOVE_TARGET } from "./constants";
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
  let textBuffer = "";
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/english-draughts.wasm`), {
    env: {
      consoleLog: (offset: number, length: number) => {
        textBuffer += new TextDecoder().decode(new Uint8Array(memory.buffer, offset, length));
      },

      flush: () => {
        console.log(textBuffer);

        textBuffer = "";
      },
    },
  });

  const exports = wasm.instance.exports as WasmExports;
  const { memory } = exports;

  return {
    init: exports.init,
    deinit: exports.deinit,

    getColor(game): PlayerColor {
      return exports.getColor(game) === COLOR_WHITE ? "white" : "black";
    },

    getEnd(_game): number {
      return 0;
    },

    getBoard(game): readonly number[] {
      const white = transBoard(8, 8, exports.getBoard(game, COLOR_WHITE), COLOR_WHITE);
      const black = transBoard(8, 8, exports.getBoard(game, COLOR_BLACK), COLOR_BLACK);

      return mergeBoards(white, black);
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
