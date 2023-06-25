import { test, expect, describe } from "vitest";

import {
  Black,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  Reset,
  White,
  WhiteBishop,
  WhiteKing,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "@/chess/js/types";

import type { IsCastled } from "@/chess/js/types";

import { generateMoveCastling, generateMoveEnPassant, generateMoveMove, generateMovePromotion } from "../generate-move";
import {
  getNextBoard,
  getNextCastling,
  getNextEnPassant,
  getNextFiftyMove,
  nextMoves,
  getNextThreefoldMap,
} from "../get-next";
import { generateBoard } from "../state";

test("reset, no move", () => {
  const board = generateBoard({
    12: BlackPawn,
    19: WhitePawn,
  });
  const move = { type: Reset } as const;

  const result = getNextBoard(board, move);
  const expected = generateBoard({
    12: BlackPawn,
    19: WhitePawn,
  });

  expect(result).toStrictEqual(expected);
});

describe("black move", () => {
  test("move", () => {
    const board = generateBoard({
      12: BlackPawn,
      19: WhitePawn,
    });
    const move = generateMoveMove(12, 28);

    const result = getNextBoard(board, move);
    const expected = generateBoard({
      28: BlackPawn,
      19: WhitePawn,
    });

    expect(result).toStrictEqual(expected);
  });

  test("castling", () => {
    const board = generateBoard({
      4: BlackKing,
      7: BlackRook,
    });
    const move = generateMoveCastling(7);

    const result = getNextBoard(board, move);
    const expected = generateBoard({
      5: BlackRook,
      6: BlackKing,
    });

    expect(result).toStrictEqual(expected);
  });

  test("en passant", () => {
    const board = generateBoard({
      35: BlackPawn,
      36: WhitePawn,
    });
    const move = generateMoveEnPassant(35, 44, 36);

    const result = getNextBoard(board, move);
    const expected = generateBoard({
      44: BlackPawn,
    });

    expect(result).toStrictEqual(expected);
  });

  test("promotion", () => {
    const board = generateBoard({
      52: BlackPawn,
    });
    const move = generateMovePromotion(52, 60, BlackQueen);

    const result = getNextBoard(board, move);
    const expected = generateBoard({
      60: BlackQueen,
    });

    expect(result).toStrictEqual(expected);
  });
});

describe("white move", () => {
  test("move", () => {
    const board = generateBoard({
      52: WhitePawn,
    });
    const move = generateMoveMove(52, 36);

    const result = getNextBoard(board, move);
    const expected = generateBoard({
      36: WhitePawn,
    });

    expect(result).toStrictEqual(expected);
  });

  test("castling", () => {
    const board = generateBoard({
      56: WhiteRook,
      60: WhiteKing,
    });
    const move = generateMoveCastling(56);

    const result = getNextBoard(board, move);
    const expected = generateBoard({
      58: WhiteKing,
      59: WhiteRook,
    });

    expect(result).toStrictEqual(expected);
  });

  test("en passant", () => {
    const board = generateBoard({
      27: WhitePawn,
      28: BlackPawn,
    });
    const move = generateMoveEnPassant(27, 20, 28);

    const result = getNextBoard(board, move);
    const expected = generateBoard({
      20: WhitePawn,
    });

    expect(result).toStrictEqual(expected);
  });

  test("promotion", () => {
    const board = generateBoard({
      12: WhitePawn,
    });
    const move = generateMovePromotion(12, 4, WhiteQueen);

    const result = getNextBoard(board, move);
    const expected = generateBoard({
      4: WhiteQueen,
    });

    expect(result).toStrictEqual(expected);
  });
});

describe("next castling flags", () => {
  test("white castling", () => {
    const castling: IsCastled = [true, true, true, true];
    const move = generateMoveCastling(56);

    const result = getNextCastling(castling, move);
    const expected = [true, true, false, false];

    expect(result).toStrictEqual(expected);
  });

  test("black castling", () => {
    const castling: IsCastled = [true, true, true, true];
    const move = generateMoveCastling(7);

    const result = getNextCastling(castling, move);
    const expected = [false, false, true, true];

    expect(result).toStrictEqual(expected);
  });

  test("white king moves", () => {
    const castling: IsCastled = [true, true, true, true];
    const move = generateMoveMove(60, 52);

    const result = getNextCastling(castling, move);
    const expected = [true, true, false, false];

    expect(result).toStrictEqual(expected);
  });

  test("black king moves", () => {
    const castling: IsCastled = [true, true, true, true];
    const move = generateMoveMove(4, 12);

    const result = getNextCastling(castling, move);
    const expected = [false, false, true, true];

    expect(result).toStrictEqual(expected);
  });

  test("white rook moves", () => {
    const castling: IsCastled = [true, true, true, true];
    const move = generateMoveMove(56, 58);

    const result = getNextCastling(castling, move);
    const expected = [true, true, false, true];

    expect(result).toStrictEqual(expected);
  });

  test("black rook moves", () => {
    const castling: IsCastled = [true, true, true, true];
    const move = generateMoveMove(7, 31);

    const result = getNextCastling(castling, move);
    const expected = [true, false, true, true];

    expect(result).toStrictEqual(expected);
  });
});

describe("black side", () => {
  test("detect double step", () => {
    const board = generateBoard({
      12: BlackPawn,
      19: WhitePawn,
    });
    const move = generateMoveMove(12, 28);

    const result = getNextEnPassant(board, move);
    const expected = 28;

    expect(result).toStrictEqual(expected);
  });

  test("not double step", () => {
    const board = generateBoard({
      12: BlackPawn,
      19: WhitePawn,
    });
    const move = generateMoveMove(12, 20);

    const result = getNextEnPassant(board, move);
    const expected = false;

    expect(result).toStrictEqual(expected);
  });

  test("not pawn step", () => {
    const board = generateBoard({
      12: BlackRook,
      19: WhitePawn,
    });
    const move = generateMoveMove(12, 28);

    const result = getNextEnPassant(board, move);
    const expected = false;

    expect(result).toStrictEqual(expected);
  });
});

describe("white side", () => {
  test("detect double step", () => {
    const board = generateBoard({
      43: BlackPawn,
      52: WhitePawn,
    });
    const move = generateMoveMove(52, 36);

    const result = getNextEnPassant(board, move);
    const expected = 36;

    expect(result).toStrictEqual(expected);
  });

  test("not double step", () => {
    const board = generateBoard({
      43: BlackPawn,
      52: WhitePawn,
    });
    const move = generateMoveMove(52, 44);

    const result = getNextEnPassant(board, move);
    const expected = false;

    expect(result).toStrictEqual(expected);
  });

  test("not pawn step", () => {
    const board = generateBoard({
      43: BlackPawn,
      52: WhiteRook,
    });
    const move = generateMoveMove(52, 36);

    const result = getNextEnPassant(board, move);
    const expected = false;

    expect(result).toStrictEqual(expected);
  });
});

describe("fifty moves", () => {
  test("pawn moves", () => {
    const board = generateBoard({
      52: WhitePawn,
    });
    const move = generateMoveMove(52, 44);

    const result = getNextFiftyMove(1, board, move);
    const expected = 0;

    expect(result).toStrictEqual(expected);
  });

  test("capturing", () => {
    const board = generateBoard({
      29: BlackKnight,
      50: WhiteBishop,
    });
    const move = generateMoveMove(50, 29);

    const result = getNextFiftyMove(1, board, move);
    const expected = 0;

    expect(result).toStrictEqual(expected);
  });

  test("neither pawn move nor capturing", () => {
    const board = generateBoard({
      50: WhiteBishop,
    });
    const move = generateMoveMove(50, 29);

    const result = getNextFiftyMove(1, board, move);
    const expected = 2;

    expect(result).toStrictEqual(expected);
  });
});

test("threefold repetition", () => {
  const map = new Map<string, number>();
  const board = generateBoard({
    4: BlackKing,
    60: WhiteKing,
  });

  const result = getNextThreefoldMap(map, board, White);
  const expected = new Map([["4k3/8/8/8/8/8/8/4K3 w", 1]]);

  expect(result).toStrictEqual(expected);
});

describe("next moves", () => {
  test("after white", () => {
    const result = nextMoves(1, White);
    const expected = 1;

    expect(result).toBe(expected);
  });

  test("after black", () => {
    const result = nextMoves(1, Black);
    const expected = 2;

    expect(result).toBe(expected);
  });
});
