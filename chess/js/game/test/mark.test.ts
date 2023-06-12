import { test, expect, describe } from "vitest";
import { getMark, invertMark, isOtherMark, isSameMark } from "../mark";
import {
  Black,
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  Empty,
  Index,
  Mark,
  Piece,
  White,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "../../types";
import { generateBoard } from "./test-util";

describe("invert mark", () => {
  test("white -> black", () => {
    const result = invertMark(White);
    const expected = Black;

    expect(result).toStrictEqual(expected);
  });

  test("black -> white", () => {
    const result = invertMark(Black);
    const expected = White;

    expect(result).toStrictEqual(expected);
  });
});

describe("get mark from piece", () => {
  const cases: [description: string, piece: Piece | Empty, mark: Mark | Empty][] = [
    ["white pawn", WhitePawn, White],
    ["white knight", WhiteKnight, White],
    ["white bishop", WhiteBishop, White],
    ["white rook", WhiteRook, White],
    ["white queen", WhiteQueen, White],
    ["white king", WhiteKing, White],

    ["black pawn", BlackPawn, Black],
    ["black knight", BlackKnight, Black],
    ["black bishop", BlackBishop, Black],
    ["black rook", BlackRook, Black],
    ["black queen", BlackQueen, Black],
    ["black king", BlackKing, Black],

    ["empty", Empty, Empty],
  ];

  test.each(cases)("%s", (_, piece, mark) => {
    const result = getMark(piece);
    const expected = mark;

    expect(result).toStrictEqual(expected);
  });
});

describe("piece mark is same or different in board", () => {
  const board = generateBoard({
    9: BlackPawn,
    10: BlackPawn,
    14: BlackKing,

    49: WhitePawn,
    50: WhitePawn,
    54: WhiteKing,
  });

  const sameMarkCases: [description: string, index1: Index, index2: Index][] = [
    ["white pawn and white pawn is same", 49, 50],
    ["white pawn and white king is same", 49, 54],
    ["black pawn and black pawn is same", 9, 10],
    ["black pawn and black king is same", 9, 14],
  ];

  test.each(sameMarkCases)("%s", (_, index1, index2) => {
    const result = isSameMark(board, index1, index2);
    const expected = true;

    expect(result).toStrictEqual(expected);
  });

  const notSameMarkCases: [description: string, index1: Index, index2: Index][] = [
    ["white pawn and black pawn is not same", 49, 9],
    ["white pawn and black king is not same", 49, 14],
    ["white pawn and empty is not same", 49, 12],
    ["empty and black pawn is not same", 52, 9],
    ["empty and empty is not same", 52, 12],
  ];

  test.each(notSameMarkCases)("%s", (_, index1, index2) => {
    const result = isSameMark(board, index1, index2);
    const expected = false;

    expect(result).toStrictEqual(expected);
  });

  const otherMarkCases: [description: string, index1: Index, index2: Index][] = [
    ["white pawn and black pawn is different", 49, 10],
    ["white pawn and black king is different", 49, 14],
    ["black pawn and white pawn is different", 9, 50],
    ["black pawn and white king is different", 9, 54],
  ];

  test.each(otherMarkCases)("%s", (_, index1, index2) => {
    const result = isOtherMark(board, index1, index2);
    const expected = true;

    expect(result).toStrictEqual(expected);
  });

  const notOtherMarkCases: [description: string, index1: Index, index2: Index][] = [
    ["white pawn and white pawn is not different", 49, 50],
    ["white pawn and white king is not different", 49, 54],
    ["white pawn and empty is not different", 49, 12],
    ["empty and black pawn is not different", 52, 9],
    ["empty and empty is not different", 52, 12],
  ];

  test.each(notOtherMarkCases)("%s", (_, index1, index2) => {
    const result = isOtherMark(board, index1, index2);
    const expected = false;

    expect(result).toStrictEqual(expected);
  });
});
