import { test, expect, describe } from "vitest";
import {
  Black,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  BoardData,
  Index,
  Mark,
  White,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
} from "../../types";
import { generateBoard } from "./test-util";
import { isCheckmate } from "../finish";

describe("checkmate", () => {
  const checkmateCases: [BoardData][] = [
    [
      //   d e f
      // 3 k . .
      // 2 . q .
      // 1 . K .
      generateBoard({
        43: BlackKing,
        52: BlackQueen,
        60: WhiteKing,
      }),
    ],
    [
      //   b c d e f
      // 3 . . . k .
      // 2 . . . . .
      // 1 r . . K .
      generateBoard({
        44: BlackKing,
        57: BlackRook,
        60: WhiteKing,
      }),
    ],
    [
      //   e f g h
      // 3 k . . .
      // 2 . n P P
      // 1 . . N K
      generateBoard({
        44: BlackKing,
        53: BlackKnight,
        54: WhitePawn,
        55: WhitePawn,
        62: WhiteKnight,
        63: WhiteKing,
      }),
    ],
  ];

  test.each(checkmateCases)("board", (board) => {
    const result = isCheckmate(board, White, false);
    const expected = Black;

    expect(result).toStrictEqual(expected);
  });

  const noCheckmateCases: [BoardData][] = [
    [
      //   d e f
      // 4 k . .
      // 3 . . .
      // 2 . q .
      // 1 . K .
      generateBoard({
        35: BlackKing,
        52: BlackQueen,
        60: WhiteKing,
      }),
    ],
    [
      //   b c d e f
      // 3 . . k . .
      // 2 . . . . .
      // 1 r . . K .
      generateBoard({
        43: BlackKing,
        57: BlackRook,
        60: WhiteKing,
      }),
    ],
    [
      //   a b c d e f g h
      // 8 . . . . . . . .
      // 7 . . . . . . . .
      // 6 . . . . . . . .
      // 5 . . . . . . . .
      // 4 . . . . . . . .
      // 3 . . . . k . . P
      // 2 . . . . . n P .
      // 1 . . . . . . N K
      generateBoard({
        44: BlackKing,
        47: WhitePawn,
        53: BlackKnight,
        54: WhitePawn,
        62: WhiteKnight,
        63: WhiteKing,
      }),
    ],
  ];

  test.each(noCheckmateCases)("board", (board) => {
    const result = isCheckmate(board, White, false);
    const expected = false;

    expect(result).toStrictEqual(expected);
  });

  const enPassantCases: [canEnPassant: false | Index, isCheckmate: false | Mark][] = [
    [false, Black],
    [27, false],
  ];

  test.each(enPassantCases)("white can en passant?: %s", (enPassant, checkmate) => {
    const board = generateBoard({
      12: BlackKnight,
      20: BlackKnight,
      27: BlackPawn,
      28: WhitePawn,
      36: WhiteKing,
      46: BlackQueen,
    });
    const result = isCheckmate(board, White, enPassant);
    const expected = checkmate;

    expect(result).toStrictEqual(expected);
  });
});
