import { expect, test } from "vitest";

import { generateMoveCastling, generateMoveEnPassant, generateMoveMove, generateMovePromotion } from "../generate-move";

test("generate move move", () => {
  const result = generateMoveMove("a1", "b2");
  const expected = ["m", "a1", "b2"];

  expect(result).toStrictEqual(expected);
});

test("generate move castling", () => {
  const result = generateMoveCastling("e8", "h8");
  const expected = ["c", "e8", "h8"];

  expect(result).toStrictEqual(expected);
});

test("generate move en passant", () => {
  const result = generateMoveEnPassant("f5", "g6", "g5");
  const expected = ["e", "f5", "g6", "g5"];

  expect(result).toStrictEqual(expected);
});

test("generate move promotion", () => {
  const result = generateMovePromotion("c7", "c8", "N");
  const expected = ["p", "c7", "c8", "N"];

  expect(result).toStrictEqual(expected);
});
