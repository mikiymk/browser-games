// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("./main.zig");
const bit_board = common.bit_board;
const BitBoard = bit_board.BitBoard;

test "BitBoard: 縦と横のサイズからビットサイズを計算して型を作成する" {
    const T = BitBoard(8, 8);

    const board: T = .{
        .field = 0,
    };

    try std.testing.expect(@TypeOf(board.field) == u64);
}

test "BitBoard.fromString: 文字列からボードを作成する" {
    const B = BitBoard(4, 4);

    const board: B = B.fromString(
        \\.o.o
        \\....
        \\....
        \\....
    , 'o');

    try std.testing.expectEqual(board.field, 0b0000_0000_0000_1010);
}

test "BitBoard.fromString: 不正な文字列の場合はすべて0になる" {
    const B = BitBoard(4, 4);

    const board: B = B.fromString(
        \\oooo
        \\oooo
        \\oooo
        \\ooooo
    , 'o');

    try std.testing.expectEqual(board.field, 0);
}

test "BitBoard.setCoordinate: 座標からそこだけビットの立ったボードを作成する" {
    // + 0 1 2 3
    // 3 0 1 2 3
    // 2 4 5 6 7
    // 1 8 9 a b
    // 0 c d e f

    const B = BitBoard(4, 4);

    {
        const board1: B = B.empty.setCoordinate(0, 0);
        const board2: B = B.fromString(
            \\....
            \\....
            \\....
            \\o...
        , 'o');
        try std.testing.expectEqual(board1.field, board2.field);
    }

    {
        const board1: B = B.empty.setCoordinate(1, 0);
        const board2: B = B.fromString(
            \\....
            \\....
            \\....
            \\.o..
        , 'o');
        try std.testing.expectEqual(board1.field, board2.field);
    }

    {
        const board1: B = B.empty.setCoordinate(0, 2);
        const board2: B = B.fromString(
            \\....
            \\o...
            \\....
            \\....
        , 'o');
        try std.testing.expectEqual(board1.field, board2.field);
    }

    {
        const board1: B = B.empty.setCoordinate(3, 3);
        const board2: B = B.fromString(
            \\...o
            \\....
            \\....
            \\....
        , 'o');
        try std.testing.expectEqual(board1.field, board2.field);
    }

    {
        const board1: B = B.empty
            .setCoordinate(0, 0)
            .setCoordinate(0, 1)
            .setCoordinate(0, 2)
            .setCoordinate(0, 3)
            .setCoordinate(1, 0)
            .setCoordinate(1, 1)
            .setCoordinate(1, 2)
            .setCoordinate(1, 3)
            .setCoordinate(2, 0)
            .setCoordinate(2, 1)
            .setCoordinate(2, 2)
            .setCoordinate(2, 3)
            .setCoordinate(3, 0)
            .setCoordinate(3, 1)
            .setCoordinate(3, 2)
            .setCoordinate(3, 3);
        const board2: B = B.fromString(
            \\oooo
            \\oooo
            \\oooo
            \\oooo
        , 'o');
        try std.testing.expectEqual(board1.field, board2.field);
    }
}

test "BitBoard.toString: ボードから文字列に変換する" {
    const B = BitBoard(4, 4);

    const board: B = B.fromString(
        \\o.oo
        \\oo.o
        \\ooo.
        \\oooo
    , 'o');

    try std.testing.expectEqualStrings(
        &board.toString('o', '.'),
        \\o.oo
        \\oo.o
        \\ooo.
        \\oooo
        ,
    );
}

test "BitBoard.Iterator: ボードのONの各ビットを繰り返す" {
    const B = BitBoard(4, 4);

    const board: B = B.fromString(
        \\.o..
        \\..o.
        \\o...
        \\...o
    , 'o');

    var iterator = board.iterator();

    try iterator.next().?.expect(
        \\.o..
        \\....
        \\....
        \\....
    );
    try iterator.next().?.expect(
        \\....
        \\..o.
        \\....
        \\....
    );
    try iterator.next().?.expect(
        \\....
        \\....
        \\o...
        \\....
    );
    try iterator.next().?.expect(
        \\....
        \\....
        \\....
        \\...o
    );

    try std.testing.expectEqual(iterator.next(), null);
}
