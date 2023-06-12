import { test, expect, describe } from "vitest";
import { BlackPawn, BlackRook, WhitePawn, WhiteRook } from "../../types";
import { generateBoard } from "./test-util";
import { generateMoveMove } from "../generate-move";
import { getNextEnPassant } from "../en-passant";

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
