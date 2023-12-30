import { PlayerTypeHuman } from "@/scripts/player";
import { sleep } from "@/scripts/sleep";

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
} from "./constants";

import type { MultiPromise } from "@/scripts/multi-promise";

type GamePtr = (number & { __unique: "Wasm pointer of Board struct" }) | 0;
type WasmExports = {
  init: () => GamePtr;
  deinit: (g: GamePtr) => void;
  setPiece: (g: GamePtr, kind: number, index: number) => void;
  getPiece: (g: GamePtr, kind: number) => bigint;
  isBlack: (g: GamePtr) => boolean;
  isEnd: (g: GamePtr) => boolean;
  winner: (g: GamePtr) => number;
  getMove: (g: GamePtr, from: number) => bigint;
  move: (g: GamePtr, from: number, to: number) => boolean;
  promote: (g: GamePtr, from: number, kind: number) => void;
  moveAi: (g: GamePtr) => void;
};

type WasmConnect = {
  init: () => GamePtr;
  deinit: (g: GamePtr) => void;

  getColor: (g: GamePtr) => number;
  getBoard: (g: GamePtr) => number[];
  getEnd: (g: GamePtr) => number;
  getMove: (g: GamePtr, from: number) => number[];

  move: (g: GamePtr, from: number, to: number) => boolean;
  promote: (g: GamePtr, from: number, kind: number) => void;

  ai: (g: GamePtr) => void;
};

const EmptyBoard = Array.from({ length: 64 }, () => CellEmpty);
const WhitePromotionBoard = Array.from({ length: 64 }, (_, index) => {
  if (index === 26) return CellWhiteKnight;
  if (index === 27) return CellWhiteBishop;
  if (index === 28) return CellWhiteRook;
  if (index === 29) return CellWhiteQueen;
  return CellEmpty;
});
const BlackPromotionBoard = Array.from({ length: 64 }, (_, index) => {
  if (index === 26) return CellBlackKnight;
  if (index === 27) return CellBlackBishop;
  if (index === 28) return CellBlackRook;
  if (index === 29) return CellBlackQueen;
  return CellEmpty;
});

const AI_SLEEP_TIME_MS = 500;

export const getWasm = async (): Promise<WasmConnect> => {
  const wasm = await WebAssembly.instantiateStreaming(fetch(`${import.meta.env.BASE_URL}/wasm/chess.wasm`));

  const exports = wasm.instance.exports as WasmExports;

  const getColor = (g: GamePtr) => {
    return exports.isBlack(g) ? Black : White;
  };

  const getBoard = (g: GamePtr) => {
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

  const getEnd = (g: GamePtr) => {
    return exports.winner(g);
  };

  const getMove = (g: GamePtr, from: number) => {
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
    init: exports.init,
    deinit: exports.deinit,

    getColor: getColor,
    getBoard: getBoard,
    getEnd: getEnd,
    getMove: getMove,

    move: exports.move,
    promote: exports.promote,

    ai: exports.moveAi,
  };
};

export const gameLoop = (
  wasm: WasmConnect,
  setColor: (color: number) => void,
  setBoard: (board: number[]) => void,
  setEnd: (end: number) => void,
  setMove: (move: number[]) => void,
  humanInput: MultiPromise<number>,
  players: { black: number; white: number },
) => {
  const {
    init,
    deinit,

    getColor,
    getBoard,
    getEnd,
    getMove,

    move,
    promote,
    ai,
  } = wasm;

  let boardPtr: GamePtr = init();
  console.log(`game start id(${boardPtr})`);

  const terminate = () => {
    console.log(`game end id(${boardPtr})`);
    deinit(boardPtr);
    boardPtr = 0;
  };

  const run = async () => {
    setBoard(getBoard(boardPtr));
    const color = getColor(boardPtr);
    console.log("color", color);

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
      console.time("ai think");
      ai(boardPtr);
      console.timeEnd("ai think");

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

    if (boardPtr) {
      setTimeout(() => {
        console.log(`game continue id(${boardPtr})`);
        void run();
      }, 0);
    }
  };

  setTimeout(() => {
    void run();
  }, 0);

  return terminate;
};

const isHuman = (color: number, players: { black: number; white: number }): boolean => {
  return (
    (color === Black && players.black === PlayerTypeHuman) || (color === White && players.white === PlayerTypeHuman)
  );
};

const inputKind = async (
  color: number,
  setBoard: (board: number[]) => void,
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
    }
  }
};
