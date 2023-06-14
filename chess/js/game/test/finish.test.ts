import { test, expect, describe } from "vitest";
import {
  Black,
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  BoardData,
  Index,
  Mark,
  White,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "@/chess/js/types";
import { generateBoard } from "../state";
import { existsCheckmatePieces, isCheckmate, isStalemate } from "../finish";

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

describe("stalemate", () => {
  test("white can move", () => {
    const board = generateBoard({
      18: BlackBishop,
      19: BlackPawn,
      27: WhitePawn,
      28: BlackPawn,
      36: WhitePawn,

      46: BlackQueen,
      63: WhiteKing,
    });
    const result = isStalemate(board, White, false);
    const expected = false;

    expect(result).toStrictEqual(expected);
  });

  test("white cannot move", () => {
    const board = generateBoard({
      19: BlackPawn,
      27: WhitePawn,
      28: BlackPawn,
      36: WhitePawn,

      46: BlackQueen,
      63: WhiteKing,
    });
    const result = isStalemate(board, White, false);
    const expected = true;

    expect(result).toStrictEqual(expected);
  });

  test("black can move", () => {
    const board = generateBoard({
      18: BlackPawn,
      26: WhitePawn,
      25: BlackPawn,
      33: WhitePawn,
      32: BlackPawn,
      40: WhitePawn,

      16: BlackKing,

      10: BlackKnight,
      3: WhiteBishop,
      11: WhiteRook,
    });
    const result = isStalemate(board, Black, false);
    const expected = false;

    expect(result).toStrictEqual(expected);
  });

  test("black cannot move", () => {
    const board = generateBoard({
      18: BlackPawn,
      26: WhitePawn,
      25: BlackPawn,
      33: WhitePawn,
      32: BlackPawn,
      40: WhitePawn,

      16: BlackKing,

      3: WhiteBishop,
      11: WhiteRook,
    });
    const result = isStalemate(board, Black, false);
    const expected = true;

    expect(result).toStrictEqual(expected);
  });
});

describe("no checkmate piece", () => {
  const checkmateCases: [string, BoardData][] = [
    [
      "1 pawn",
      generateBoard({
        4: BlackKing,
        52: WhitePawn,
        60: WhiteKing,
      }),
    ],
    [
      "1 queen",
      generateBoard({
        4: BlackKing,
        52: WhiteQueen,
        60: WhiteKing,
      }),
    ],
    [
      "1 rook",
      generateBoard({
        4: BlackKing,
        52: WhiteRook,
        60: WhiteKing,
      }),
    ],
    [
      "1 bishop and 1 knight",
      generateBoard({
        4: BlackKing,
        52: WhiteBishop,
        53: WhiteKnight,
        60: WhiteKing,
      }),
    ],
    [
      "2 bishops",
      generateBoard({
        4: BlackKing,
        52: WhiteBishop,
        53: WhiteBishop,
        60: WhiteKing,
      }),
    ],
  ];
  const noCheckmateCases: [string, BoardData][] = [
    [
      "1 knight",
      generateBoard({
        4: BlackKing,
        52: WhiteKnight,
        60: WhiteKing,
      }),
    ],

    [
      "1 bishop",
      generateBoard({
        4: BlackKing,
        52: WhiteBishop,
        60: WhiteKing,
      }),
    ],
    [
      "2 knights",
      generateBoard({
        4: BlackKing,
        52: WhiteKnight,
        53: WhiteKnight,
        60: WhiteKing,
      }),
    ],
  ];

  test.each(checkmateCases)("%s", (_, board) => {
    const result = existsCheckmatePieces(board);
    const expected = true;

    expect(result).toBe(expected);
  });
  test.each(noCheckmateCases)("%s", (_, board) => {
    const result = existsCheckmatePieces(board);
    const expected = false;

    expect(result).toBe(expected);
  });
});
