import { test, expect, describe } from "vitest";
import {
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  BoardData,
  GameEnd,
  Index,
  White,
  WhiteKing,
  WhitePawn,
  WinnerBlack,
} from "../../types";
import { generateBoard } from "./test-util";
import { isCheckmate } from "../finish";

describe("checkmate", () => {
  const checkmateCases: [BoardData][] = [
    [
      generateBoard({
        43: BlackKing,
        52: BlackQueen,
        60: WhiteKing,
      }),
    ],
    [
      generateBoard({
        44: BlackKing,
        57: BlackRook,
        60: WhiteKing,
      }),
    ],
  ];
  test.each(checkmateCases)("board", (board) => {
    const result = isCheckmate(board, White, false);
    const expected = WinnerBlack;

    expect(result).toStrictEqual(expected);
  });

  const enPassantCases: [canEnPassant: false | Index, isCheckmate: false | GameEnd][] = [
    [false, WinnerBlack],
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
