import { test, expect, describe } from "vitest";

import { Black, BlackKing, BlackKnight, White, WhiteBishop, WhiteKing, WhitePawn } from "@/chess/js/types";

import { generateMoveMove } from "../generate-move";
import { getNextFiftyMove, nextMoves, getNextThreefoldMap } from "../get-next";
import { generateBoard } from "../state";

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
