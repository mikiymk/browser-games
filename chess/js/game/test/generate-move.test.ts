import { test, expect } from "vitest";
import { generateMoveCastling, generateMoveEnPassant, generateMoveMove, generateMovePromotion } from "../generate-move";
import { Castling, EnPassant, Move, Promotion, WhitePawn } from "@/chess/js/types";

test("generate move move", () => {
  const result = generateMoveMove(1, 5);
  const expected = { type: Move, from: 1, to: 5 };

  expect(result).toStrictEqual(expected);
});

test("generate move castling", () => {
  const result = generateMoveCastling(7);
  const expected = { type: Castling, rook: 7 };

  expect(result).toStrictEqual(expected);
});

test("generate move en passant", () => {
  const result = generateMoveEnPassant(1, 5, 3);
  const expected = { type: EnPassant, from: 1, to: 5, capture: 3 };

  expect(result).toStrictEqual(expected);
});

test("generate move promotion", () => {
  const result = generateMovePromotion(1, 5, WhitePawn);
  const expected = { type: Promotion, from: 1, to: 5, piece: WhitePawn };

  expect(result).toStrictEqual(expected);
});
