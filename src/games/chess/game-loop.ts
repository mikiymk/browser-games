import { sleep } from "@/scripts/sleep";
import { PlayerTypeHuman } from "@/scripts/player";

import { Black, White } from "./types";
import {
  CellWhiteKnight,
  CellWhiteBishop,
  CellWhiteRook,
  CellWhiteQueen,
  CellEmpty,
  CellBlackKnight,
  CellBlackBishop,
  CellBlackRook,
  CellBlackQueen,
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
export const gameLoop = (
  wasm: WasmConnect,
  setColor: (color: number) => void,
  setBoard: (board: number[]) => void,
  setEnd: (end: number) => void,
  setMove: (move: number[]) => void,
  humanInput: MultiPromise<number>,
  players: { black: number; white: number },
  onEnd: () => void,
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
    onEnd();
  };

  const run = async () => {
    setBoard(getBoard(boardPtr));
    const color = getColor(boardPtr);

    if (isHuman(color, players)) {
      const from = await humanInput.request();

      setMove(getMove(boardPtr, from));

      const to = await humanInput.request();

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

    const end = getEnd(boardPtr);
    if (end !== 0) {
      setEnd(end);
      terminate();
    }

    if (boardPtr) {
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
  } else {
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

  return CellEmpty;
};
