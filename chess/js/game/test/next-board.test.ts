import { test, expect, describe } from "vitest";
import {
  BlackKing,
  BlackPawn,
  BlackQueen,
  BlackRook,
  Reset,
  WhiteKing,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
}  from "@/chess/js/types";
import { generateBoard } from "./test-util";
import { generateMoveCastling, generateMoveEnPassant, generateMoveMove, generateMovePromotion } from "../generate-move";
import { getNewBoard } from "../next-board";

test("reset, no move", () => {
  const board = generateBoard({
    12: BlackPawn,
    19: WhitePawn,
  });
  const move = { type: Reset } as const;

  const result = getNewBoard(board, move);
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

    const result = getNewBoard(board, move);
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

    const result = getNewBoard(board, move);
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

    const result = getNewBoard(board, move);
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

    const result = getNewBoard(board, move);
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

    const result = getNewBoard(board, move);
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

    const result = getNewBoard(board, move);
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

    const result = getNewBoard(board, move);
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

    const result = getNewBoard(board, move);
    const expected = generateBoard({
      4: WhiteQueen,
    });

    expect(result).toStrictEqual(expected);
  });
});
