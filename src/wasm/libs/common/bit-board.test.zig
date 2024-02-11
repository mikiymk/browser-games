// std import
const std = @import("std");
const builtin = @import("builtin");
const testing = std.testing;

// common import
const common = @import("./main.zig");
const bit_board = common.bit_board;
const BitBoard = bit_board.BitBoard;

test "BitBoard: 縦と横のサイズからビットサイズを計算して型を作成する" {
    {
        const B = BitBoard(8, 8);

        try testing.expectEqual(B.Board, u64);
        try testing.expectEqual(B.UHeight, u3);
        try testing.expectEqual(B.UWidth, u3);
        try testing.expectEqual(B.UBitLength, u6);
    }

    {
        const B = BitBoard(9, 7);

        try testing.expectEqual(B.Board, u63);
        try testing.expectEqual(B.UHeight, u4);
        try testing.expectEqual(B.UWidth, u3);
        try testing.expectEqual(B.UBitLength, u6);
    }
}

test "BitBoard.fromString: 文字列からボードを作成する" {
    const B = BitBoard(4, 4);

    const board: B.Board = B.fromString(
        \\.o.o
        \\....
        \\....
        \\....
    , 'o');

    try testing.expectEqual(board, 0b0000_0000_0000_1010);
}

test "BitBoard.fromString: 不正な文字列の場合はすべて0になる" {
    const B = BitBoard(4, 4);

    const board: B.Board = B.fromString(
        \\oooo
        \\oooo
        \\oooo
        \\ooooo
    , 'o');

    try testing.expectEqual(board, 0);
}

test "BitBoard.fromCoordinate: 座標からそこだけビットの立ったボードを作成する" {
    // + 0 1 2 3
    // 3 0 1 2 3
    // 2 4 5 6 7
    // 1 8 9 a b
    // 0 c d e f

    const B = BitBoard(4, 4);

    {
        const board1: B.Board = B.fromCoordinate(0, 0);
        const board2: B.Board = B.fromString(
            \\....
            \\....
            \\....
            \\o...
        , 'o');

        try testing.expectEqual(board1, board2);
    }

    {
        const board1: B.Board = B.fromCoordinate(1, 0);
        const board2: B.Board = B.fromString(
            \\....
            \\....
            \\....
            \\.o..
        , 'o');

        try testing.expectEqual(board1, board2);
    }

    {
        const board1: B.Board = B.fromCoordinate(0, 2);
        const board2: B.Board = B.fromString(
            \\....
            \\o...
            \\....
            \\....
        , 'o');

        try testing.expectEqual(board1, board2);
    }

    {
        const board1: B.Board = B.fromCoordinate(3, 3);
        const board2: B.Board = B.fromString(
            \\...o
            \\....
            \\....
            \\....
        , 'o');

        try testing.expectEqual(board1, board2);
    }
}

test "BitBoard.toString: ボードから文字列に変換する" {
    const B = BitBoard(4, 4);

    const board: B.Board = B.fromString(
        \\o.oo
        \\oo.o
        \\ooo.
        \\oooo
    , 'o');

    try testing.expectEqualStrings(
        &B.toString(board, 'o', '.'),
        \\o.oo
        \\oo.o
        \\ooo.
        \\oooo
        ,
    );
}

test "BitBoard.Iterator: ボードのONの各ビットを繰り返す" {
    const B = BitBoard(4, 4);

    const board: B.Board = B.fromString(
        \\.o..
        \\..o.
        \\o...
        \\...o
    , 'o');

    var iterator = B.iterator(board);

    try B.expect(iterator.next().?,
        \\.o..
        \\....
        \\....
        \\....
    );
    try B.expect(iterator.next().?,
        \\....
        \\..o.
        \\....
        \\....
    );
    try B.expect(iterator.next().?,
        \\....
        \\....
        \\o...
        \\....
    );
    try B.expect(iterator.next().?,
        \\....
        \\....
        \\....
        \\...o
    );

    try testing.expectEqual(iterator.next(), null);
}
