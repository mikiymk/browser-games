import { test, expect, describe } from "vitest";
import {
  Black,
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  Castling,
  EnPassant,
  Move,
  Promotion,
  White,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "@/chess/js/types";
import { generateBoard } from "../state";
import { getCastling, getPiecesMoves } from "../get-moves";

describe("pawn", () => {
  test("white pawn", () => {
    const board = generateBoard({
      35: WhitePawn,
    });
    const result = [...getPiecesMoves(board, White, false)];
    const expected = { type: Move, from: 35, to: 27 };

    expect(result).toContainEqual(expected);
  });

  test("black pawn", () => {
    const board = generateBoard({
      28: BlackPawn,
    });
    const result = [...getPiecesMoves(board, Black, false)];
    const expected = { type: Move, from: 28, to: 36 };

    expect(result).toContainEqual(expected);
  });

  test("white pawn double steps", () => {
    const board = generateBoard({
      51: WhitePawn,
    });
    const result = [...getPiecesMoves(board, White, false)];
    const expected = { type: Move, from: 51, to: 35 };

    expect(result).toContainEqual(expected);
  });

  test("black pawn double steps", () => {
    const board = generateBoard({
      12: BlackPawn,
    });
    const result = [...getPiecesMoves(board, Black, false)];
    const expected = { type: Move, from: 12, to: 28 };

    expect(result).toContainEqual(expected);
  });

  test("white pawn capturing", () => {
    const board = generateBoard({
      35: WhitePawn,
      28: BlackPawn,
    });
    const result = [...getPiecesMoves(board, White, false)];
    const expected = { type: Move, from: 35, to: 28 };

    expect(result).toContainEqual(expected);
  });

  test("black pawn capturing", () => {
    const board = generateBoard({
      35: WhitePawn,
      28: BlackPawn,
    });
    const result = [...getPiecesMoves(board, Black, false)];
    const expected = { type: Move, from: 28, to: 35 };

    expect(result).toContainEqual(expected);
  });

  test("white pawn facing other piece", () => {
    const board = generateBoard({
      35: WhitePawn,
      27: BlackPawn,
    });
    const result = [...getPiecesMoves(board, White, false)];
    const expected = { type: Move, from: 35, to: 27 };

    expect(result).not.toContainEqual(expected);
  });

  test("black pawn facing other piece", () => {
    const board = generateBoard({
      35: WhitePawn,
      27: BlackPawn,
    });
    const result = [...getPiecesMoves(board, Black, false)];
    const expected = { type: Move, from: 27, to: 35 };

    expect(result).not.toContainEqual(expected);
  });

  test("white pawn promotion", () => {
    const board = generateBoard({
      11: WhitePawn,
    });
    const result = [...getPiecesMoves(board, White, false)];
    const expected = { type: Promotion, from: 11, to: 3, piece: WhiteQueen };
    const notExpected = { type: Move, from: 11, to: 3 };

    expect(result).toContainEqual(expected);
    expect(result).not.toContainEqual(notExpected);
  });

  test("black pawn promotion", () => {
    const board = generateBoard({
      52: BlackPawn,
    });
    const result = [...getPiecesMoves(board, Black, false)];
    const expected = { type: Promotion, from: 52, to: 60, piece: BlackQueen };
    const notExpected = { type: Move, from: 52, to: 60 };

    expect(result).toContainEqual(expected);
    expect(result).not.toContainEqual(notExpected);
  });

  test("white pawn en passant", () => {
    const board = generateBoard({
      27: WhitePawn,
      28: BlackPawn,
    });
    const result = [...getPiecesMoves(board, White, 28)];
    const expected = { type: EnPassant, from: 27, to: 20, capture: 28 };

    expect(result).toContainEqual(expected);
  });

  test("black pawn en passant", () => {
    const board = generateBoard({
      35: WhitePawn,
      36: BlackPawn,
    });
    const result = [...getPiecesMoves(board, Black, 35)];
    const expected = { type: EnPassant, from: 36, to: 43, capture: 35 };

    expect(result).toContainEqual(expected);
  });
});

describe("knight", () => {
  test("white knight", () => {
    const board = generateBoard({
      27: WhiteKnight,
    });
    const result = [...getPiecesMoves(board, White, false)];

    expect(result).toHaveLength(8);
    expect(result).toContainEqual({ type: Move, from: 27, to: 10 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 12 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 17 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 21 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 33 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 37 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 42 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 44 });
  });

  test("black knight", () => {
    const board = generateBoard({
      27: BlackKnight,
    });
    const result = [...getPiecesMoves(board, Black, false)];

    expect(result).toHaveLength(8);
    expect(result).toContainEqual({ type: Move, from: 27, to: 10 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 12 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 17 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 21 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 33 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 37 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 42 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 44 });
  });
});

describe("bishop", () => {
  test("white bishop", () => {
    const board = generateBoard({
      27: WhiteBishop,
      13: BlackPawn,
      48: WhitePawn,
    });
    const result = [...getPiecesMoves(board, White, false)];

    expect(result).toContainEqual({ type: Move, from: 27, to: 18 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 20 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 34 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 36 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 13 });
    expect(result).not.toContainEqual({ type: Move, from: 27, to: 48 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 0 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 63 });
  });

  test("black bishop", () => {
    const board = generateBoard({
      27: BlackBishop,
      13: BlackPawn,
      48: WhitePawn,
    });
    const result = [...getPiecesMoves(board, Black, false)];

    expect(result).toContainEqual({ type: Move, from: 27, to: 18 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 20 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 34 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 36 });

    expect(result).not.toContainEqual({ type: Move, from: 27, to: 13 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 48 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 0 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 63 });
  });
});

describe("rook", () => {
  test("white rook", () => {
    const board = generateBoard({
      27: WhiteRook,
      3: BlackPawn,
      31: WhitePawn,
    });
    const result = [...getPiecesMoves(board, White, false)];

    expect(result).toContainEqual({ type: Move, from: 27, to: 19 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 26 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 28 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 35 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 3 });
    expect(result).not.toContainEqual({ type: Move, from: 27, to: 31 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 24 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 59 });
  });

  test("black rook", () => {
    const board = generateBoard({
      27: BlackRook,
      3: BlackPawn,
      31: WhitePawn,
    });
    const result = [...getPiecesMoves(board, Black, false)];

    expect(result).toContainEqual({ type: Move, from: 27, to: 19 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 26 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 28 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 35 });

    expect(result).not.toContainEqual({ type: Move, from: 27, to: 3 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 31 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 24 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 59 });
  });
});

describe("queen", () => {
  test("white queen", () => {
    const board = generateBoard({
      27: WhiteQueen,
      3: BlackPawn,
      13: BlackPawn,
      31: WhitePawn,
      48: WhitePawn,
    });
    const result = [...getPiecesMoves(board, White, false)];

    expect(result).toContainEqual({ type: Move, from: 27, to: 19 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 26 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 28 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 35 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 3 });
    expect(result).not.toContainEqual({ type: Move, from: 27, to: 31 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 24 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 59 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 18 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 20 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 34 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 36 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 13 });
    expect(result).not.toContainEqual({ type: Move, from: 27, to: 48 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 0 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 63 });
  });

  test("black queen", () => {
    const board = generateBoard({
      27: BlackQueen,
      3: BlackPawn,
      13: BlackPawn,
      31: WhitePawn,
      48: WhitePawn,
    });
    const result = [...getPiecesMoves(board, Black, false)];

    expect(result).toContainEqual({ type: Move, from: 27, to: 19 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 26 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 28 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 35 });

    expect(result).not.toContainEqual({ type: Move, from: 27, to: 3 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 31 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 24 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 59 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 18 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 20 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 34 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 36 });

    expect(result).not.toContainEqual({ type: Move, from: 27, to: 13 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 48 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 0 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 63 });
  });
});

describe("king", () => {
  test("white king", () => {
    const board = generateBoard({
      27: WhiteKing,
    });
    const result = [...getPiecesMoves(board, White, false)];

    expect(result).toContainEqual({ type: Move, from: 27, to: 19 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 18 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 20 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 26 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 28 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 34 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 35 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 36 });
  });

  test("black king", () => {
    const board = generateBoard({
      27: BlackKing,
    });
    const result = [...getPiecesMoves(board, Black, false)];

    expect(result).toContainEqual({ type: Move, from: 27, to: 19 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 18 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 20 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 26 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 28 });

    expect(result).toContainEqual({ type: Move, from: 27, to: 34 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 35 });
    expect(result).toContainEqual({ type: Move, from: 27, to: 36 });
  });
});

describe("castling", () => {
  test("black king, queen side", () => {
    const board = generateBoard({
      4: BlackKing,
      0: BlackRook,
    });
    const result = [...getCastling(board, [true, false, false, false], Black)];
    const expected = { type: Castling, rook: 0 };

    expect(result).toContainEqual(expected);
  });

  test("black king, king side", () => {
    const board = generateBoard({
      4: BlackKing,
      7: BlackRook,
    });
    const result = [...getCastling(board, [false, true, false, false], Black)];
    const expected = { type: Castling, rook: 7 };

    expect(result).toContainEqual(expected);
  });

  test("white king, queen side", () => {
    const board = generateBoard({
      60: WhiteKing,
      56: WhiteRook,
    });
    const result = [...getCastling(board, [false, false, true, false], White)];
    const expected = { type: Castling, rook: 56 };

    expect(result).toContainEqual(expected);
  });

  test("white king, king side", () => {
    const board = generateBoard({
      60: WhiteKing,
      63: WhiteRook,
    });
    const result = [...getCastling(board, [false, false, false, true], White)];
    const expected = { type: Castling, rook: 63 };

    expect(result).toContainEqual(expected);
  });

  test("black king, queen side, king is in check", () => {
    const board = generateBoard({
      28: WhiteRook,

      4: BlackKing,
      0: BlackRook,
    });
    const result = [...getCastling(board, [true, false, false, false], Black)];
    const expected = { type: Castling, rook: 0 };

    expect(result).not.toContainEqual(expected);
  });

  test("black king, king side, piece betweens king and rook", () => {
    const board = generateBoard({
      6: BlackKnight,

      4: BlackKing,
      7: BlackRook,
    });
    const result = [...getCastling(board, [false, true, false, false], Black)];
    const expected = { type: Castling, rook: 7 };

    expect(result).not.toContainEqual(expected);
  });

  test("white king, queen side, king passing square is attacked", () => {
    const board = generateBoard({
      43: BlackRook,

      60: WhiteKing,
      56: WhiteRook,
    });
    const result = [...getCastling(board, [false, false, true, false], White)];
    const expected = { type: Castling, rook: 56 };

    expect(result).not.toContainEqual(expected);
  });

  test("white king, king side, king finish square is attacked", () => {
    const board = generateBoard({
      46: BlackRook,

      60: WhiteKing,
      63: WhiteRook,
    });
    const result = [...getCastling(board, [false, false, false, true], White)];
    const expected = { type: Castling, rook: 63 };

    expect(result).not.toContainEqual(expected);
  });
});
