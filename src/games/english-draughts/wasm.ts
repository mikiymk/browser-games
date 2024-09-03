import type { GameObject } from "./game-loop";

type WasmExports = {
  init: () => GameObject;
  deinit: (g: GameObject) => void;
  setPiece: (g: GameObject, kind: number, index: number) => void;
  getPiece: (g: GameObject, kind: number) => bigint;
  isBlack: (g: GameObject) => boolean;
  isEnd: (g: GameObject) => boolean;
  winner: (g: GameObject) => number;
  getMove: (g: GameObject, from: number) => bigint;
  move: (g: GameObject, from: number, to: number) => boolean;
  promote: (g: GameObject, from: number, kind: number) => void;
  moveAi: (g: GameObject) => void;
};

export type WasmConnect = {
  readonly init: () => GameObject;
  readonly deinit: (g: GameObject) => void;

  readonly getColor: (g: GameObject) => number;
  readonly getBoard: (g: GameObject) => readonly number[];
  readonly getEnd: (g: GameObject) => number;
  readonly getMove: (g: GameObject, from: number) => readonly number[];

  readonly move: (g: GameObject, from: number, to: number) => boolean;
  readonly promote: (g: GameObject, from: number, kind: number) => void;

  readonly ai: (g: GameObject) => void;
};

export const getWasm = async (): Promise<WasmConnect> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/chess.wasm`));

  const exports = wasm.instance.exports as WasmExports;

  return {
    init: exports.init,
    deinit: exports.deinit,
  };
};
