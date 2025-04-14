import type { MultiPromise } from "../../scripts/multi-promise.ts";
import type { PlayerType } from "../../scripts/player.ts";

import { PlayerTypeHuman } from "../../scripts/player.ts";
import { sleep } from "../../scripts/sleep.ts";
import {
  Black,
  CellBlackBishop,
  CellBlackKing,
  CellBlackKnight,
  CellBlackPawn,
  CellBlackQueen,
  CellBlackRook,
  CellEmpty,
  CellWhiteBishop,
  CellWhiteKing,
  CellWhiteKnight,
  CellWhitePawn,
  CellWhiteQueen,
  CellWhiteRook,
  EndNotYet,
  MoveFrom,
  MoveTarget,
  White,
} from "./constants.ts";

type GamePtr = 0 | (number & { readonly __unique: "Wasm pointer of Board struct" });
type Players = {
  readonly black: PlayerType;
  readonly white: PlayerType;
};

type WasmConnect = {
  readonly ai: (g: GamePtr) => void;
  readonly deinit: (g: GamePtr) => void;

  readonly getBoard: (g: GamePtr) => readonly number[];
  readonly getColor: (g: GamePtr) => number;
  readonly getEnd: (g: GamePtr) => number;
  readonly getMove: (g: GamePtr, from: number) => readonly number[];

  readonly init: () => GamePtr;
  readonly move: (g: GamePtr, from: number, to: number) => boolean;

  readonly promote: (g: GamePtr, from: number, kind: number) => void;
};

type WasmExports = {
  deinit: (g: GamePtr) => void;
  getMove: (g: GamePtr, from: number) => bigint;
  getPiece: (g: GamePtr, kind: number) => bigint;
  init: () => GamePtr;
  isBlack: (g: GamePtr) => boolean;
  isEnd: (g: GamePtr) => boolean;
  move: (g: GamePtr, from: number, to: number) => boolean;
  moveAi: (g: GamePtr) => void;
  promote: (g: GamePtr, from: number, kind: number) => void;
  setPiece: (g: GamePtr, kind: number, index: number) => void;
  winner: (g: GamePtr) => number;
};

const EmptyBoard = Array.from({ length: 64 }, () => CellEmpty);
const WhitePromotionBoard = Array.from({ length: 64 }, (_, index) => {
  if (index === 26) {
    return CellWhiteKnight;
  }
  if (index === 27) {
    return CellWhiteBishop;
  }
  if (index === 28) {
    return CellWhiteRook;
  }
  if (index === 29) {
    return CellWhiteQueen;
  }

  return CellEmpty;
});
const BlackPromotionBoard = Array.from({ length: 64 }, (_, index) => {
  if (index === 26) {
    return CellBlackKnight;
  }
  if (index === 27) {
    return CellBlackBishop;
  }
  if (index === 28) {
    return CellBlackRook;
  }
  if (index === 29) {
    return CellBlackQueen;
  }

  return CellEmpty;
});

const AI_SLEEP_TIME_MS = 500;

export const getWasm = async (): Promise<WasmConnect> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/chess.wasm`));

  const exports = wasm.instance.exports as WasmExports;

  const getColor = (g: GamePtr): number => {
    return exports.isBlack(g) ? Black : White;
  };

  const getBoard = (g: GamePtr): readonly number[] => {
    const blackPawn = exports.getPiece(g, CellBlackPawn);
    const blackKnight = exports.getPiece(g, CellBlackKnight);
    const blackBishop = exports.getPiece(g, CellBlackBishop);
    const blackRook = exports.getPiece(g, CellBlackRook);
    const blackQueen = exports.getPiece(g, CellBlackQueen);
    const blackKing = exports.getPiece(g, CellBlackKing);
    const whitePawn = exports.getPiece(g, CellWhitePawn);
    const whiteKnight = exports.getPiece(g, CellWhiteKnight);
    const whiteBishop = exports.getPiece(g, CellWhiteBishop);
    const whiteRook = exports.getPiece(g, CellWhiteRook);
    const whiteQueen = exports.getPiece(g, CellWhiteQueen);
    const whiteKing = exports.getPiece(g, CellWhiteKing);

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    return Array.from({ length: 64 }, (_, index) => {
      const bitBoard = 1n << BigInt(index);

      if (bitBoard & blackPawn) {
        return CellBlackPawn;
      }
      if (blackKnight & bitBoard) {
        return CellBlackKnight;
      }
      if (blackBishop & bitBoard) {
        return CellBlackBishop;
      }
      if (blackRook & bitBoard) {
        return CellBlackRook;
      }
      if (blackQueen & bitBoard) {
        return CellBlackQueen;
      }
      if (blackKing & bitBoard) {
        return CellBlackKing;
      }
      if (whitePawn & bitBoard) {
        return CellWhitePawn;
      }
      if (whiteKnight & bitBoard) {
        return CellWhiteKnight;
      }
      if (whiteBishop & bitBoard) {
        return CellWhiteBishop;
      }
      if (whiteRook & bitBoard) {
        return CellWhiteRook;
      }
      if (whiteQueen & bitBoard) {
        return CellWhiteQueen;
      }
      if (whiteKing & bitBoard) {
        return CellWhiteKing;
      }

      return CellEmpty;
    });
  };

  const getEnd = (g: GamePtr): number => {
    return exports.winner(g);
  };

  const getMove = (g: GamePtr, from: number): readonly number[] => {
    const moveBitBoard = exports.getMove(g, from);

    return Array.from({ length: 64 }, (_, index) => {
      const bitBoard = 1n << BigInt(index);

      if (index === from) {
        return MoveFrom;
      }
      if (bitBoard & moveBitBoard) {
        return MoveTarget;
      }

      return CellEmpty;
    });
  };

  return {
    ai: exports.moveAi,
    deinit: exports.deinit,

    getBoard: getBoard,
    getColor: getColor,
    getEnd: getEnd,
    getMove: getMove,

    init: exports.init,
    move: exports.move,

    promote: exports.promote,
  };
};

const isHuman = (color: number, players: Players): boolean => {
  return (
    (color === Black && players.black === PlayerTypeHuman) || (color === White && players.white === PlayerTypeHuman)
  );
};

const inputKind = async (
  color: number,
  setBoard: (board: readonly number[]) => void,
  humanInput: MultiPromise<number>,
): Promise<number> => {
  if (color === Black) {
    setBoard(BlackPromotionBoard);
  } else {
    setBoard(WhitePromotionBoard);
  }

  for (;;) {
    const kindIndex = await humanInput.request();

    if (color === Black) {
      switch (kindIndex) {
        case 26: {
          return CellBlackKnight;
        }

        case 27: {
          return CellBlackBishop;
        }
        case 28: {
          return CellBlackRook;
        }
        case 29: {
          return CellBlackQueen;
        }
        default:
      }
    }

    switch (kindIndex) {
      case 26: {
        return CellWhiteKnight;
      }
      case 27: {
        return CellWhiteBishop;
      }
      case 28: {
        return CellWhiteRook;
      }
      case 29: {
        return CellWhiteQueen;
      }
      default:
    }
  }
};

export const gameLoop = (
  wasm: WasmConnect,
  setColor: (color: number) => void,
  setBoard: (board: readonly number[]) => void,
  setEnd: (end: number) => void,
  setMove: (move: readonly number[]) => void,
  humanInput: MultiPromise<number>,
  players: Players,
): (() => void) => {
  const {
    ai,
    deinit,

    getBoard,
    getColor,
    getEnd,
    getMove,

    init,
    move,
    promote,
  } = wasm;

  let boardPtr: GamePtr = init();

  const terminate = (): void => {
    deinit(boardPtr);
    boardPtr = 0;
  };

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  const run = async (): Promise<void> => {
    setBoard(getBoard(boardPtr));
    const color = getColor(boardPtr);

    if (isHuman(color, players)) {
      let from: number;
      let to: number;

      for (;;) {
        setMove(EmptyBoard);

        from = await humanInput.request();

        const moves = getMove(boardPtr, from);

        if (!moves.includes(MoveTarget)) {
          continue;
        }

        setMove(moves);

        to = await humanInput.request();

        if (moves[to] === MoveTarget) {
          break;
        }
      }

      if (move(boardPtr, from, to)) {
        const kind = await inputKind(color, setBoard, humanInput);

        promote(boardPtr, to, kind);
      }
    } else {
      ai(boardPtr);

      await sleep(AI_SLEEP_TIME_MS);
    }

    setColor(getColor(boardPtr));
    setBoard(getBoard(boardPtr));
    setMove(EmptyBoard);

    const end = getEnd(boardPtr);
    if (end !== EndNotYet) {
      setEnd(end);
      terminate();
    }

    if (boardPtr !== 0) {
      setTimeout(() => {
        void run();
      }, 0);
    }
  };

  setTimeout(() => {
    void run();
  }, 0);

  return terminate;
};
