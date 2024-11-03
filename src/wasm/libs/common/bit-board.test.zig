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

        try testing.expectEqual(B.Board, std.bit_set.StaticBitSet(64));
        try testing.expectEqual(B.Height, u3);
        try testing.expectEqual(B.Width, u3);
        try testing.expectEqual(B.Index, u6);
    }

    {
        const B = BitBoard(9, 7);

        try testing.expectEqual(B.Board, std.bit_set.StaticBitSet(63));
        try testing.expectEqual(B.Height, u4);
        try testing.expectEqual(B.Width, u3);
        try testing.expectEqual(B.Index, u6);
    }
}

test "BitBoard.fromString: 文字列からボードを作成する" {
    const B = BitBoard(4, 4);

    const board = B.fromString(
        \\.o.o
        \\....
        \\....
        \\....
    , 'o');

    try testing.expectEqual(board, B.fromInteger(0b0000_0000_0000_1010));
}

test "BitBoard.fromCoordinate: 座標からそこだけビットの立ったボードを作成する" {
    // + 0 1 2 3
    // 3 0 1 2 3
    // 2 4 5 6 7
    // 1 8 9 a b
    // 0 c d e f

    const B = BitBoard(4, 4);

    {
        const board1 = B.fromCoordinate(0, 0);
        const board2 = B.fromString(
            \\....
            \\....
            \\....
            \\o...
        , 'o');

        try testing.expectEqual(board1, board2);
    }

    {
        const board1 = B.fromCoordinate(1, 0);
        const board2 = B.fromString(
            \\....
            \\....
            \\....
            \\.o..
        , 'o');

        try testing.expectEqual(board1, board2);
    }

    {
        const board1 = B.fromCoordinate(0, 2);
        const board2 = B.fromString(
            \\....
            \\o...
            \\....
            \\....
        , 'o');

        try testing.expectEqual(board1, board2);
    }

    {
        const board1 = B.fromCoordinate(3, 3);
        const board2 = B.fromString(
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

    const board = B.fromString(
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

    const board: B = B.fromString(
        \\.o..
        \\..o.
        \\o...
        \\...o
    , 'o');

    var iterator = B.iterator(board);

    try B.expect(B.fromIndex(iterator.next().?),
        \\.o..
        \\....
        \\....
        \\....
    );
    try B.expect(B.fromIndex(iterator.next().?),
        \\....
        \\..o.
        \\....
        \\....
    );
    try B.expect(B.fromIndex(iterator.next().?),
        \\....
        \\....
        \\o...
        \\....
    );
    try B.expect(B.fromIndex(iterator.next().?),
        \\....
        \\....
        \\....
        \\...o
    );

    try testing.expectEqual(iterator.next(), null);
}

test "BitBoard.move: ボードの駒を1つ動かしたボードを得る" {
    const B = BitBoard(3, 3);

    const board = B.fromString(
        \\...
        \\.o.
        \\...
    , 'o');

    try board.move(.n).expect(
        \\.o.
        \\...
        \\...
    );

    try board.move(.s).expect(
        \\...
        \\...
        \\.o.
    );

    try board.move(.e).expect(
        \\...
        \\..o
        \\...
    );

    try board.move(.w).expect(
        \\...
        \\o..
        \\...
    );

    try board.move(.ne).expect(
        \\..o
        \\...
        \\...
    );

    try board.move(.nw).expect(
        \\o..
        \\...
        \\...
    );

    try board.move(.se).expect(
        \\...
        \\...
        \\..o
    );

    try board.move(.sw).expect(
        \\...
        \\...
        \\o..
    );
}

test "BitBoard.shl: ボードの左シフトしたボードを得る" {
    const B = BitBoard(16, 16);

    const board = B.fromString(
        \\o...............
        \\.o............o.
        \\................
        \\...............o
        \\o...............
        \\.o..............
        \\..............o.
        \\...............o
        \\o...............
        \\..............o.
        \\.o..............
        \\...............o
        \\o...............
        \\................
        \\.o............o.
        \\...............o
    , 'o');

    try board.shl(1).expect(
        \\.o..............
        \\..o............o
        \\................
        \\................
        \\oo..............
        \\..o.............
        \\...............o
        \\................
        \\oo..............
        \\...............o
        \\..o.............
        \\................
        \\oo..............
        \\................
        \\..o............o
        \\................
    );

    try board.shl(64).expect(
        \\................
        \\................
        \\................
        \\................
        \\o...............
        \\.o............o.
        \\................
        \\...............o
        \\o...............
        \\.o..............
        \\..............o.
        \\...............o
        \\o...............
        \\..............o.
        \\.o..............
        \\...............o
    );
}

test "BitBoard.shr: ボードの右シフトしたボードを得る" {
    const B = BitBoard(16, 16);

    const board = B.fromString(
        \\o...............
        \\.o............o.
        \\................
        \\...............o
        \\o...............
        \\.o..............
        \\..............o.
        \\...............o
        \\o...............
        \\..............o.
        \\.o..............
        \\...............o
        \\o...............
        \\................
        \\.o............o.
        \\...............o
    , 'o');

    try board.shr(1).expect(
        \\................
        \\o............o..
        \\................
        \\..............oo
        \\................
        \\o...............
        \\.............o..
        \\..............oo
        \\................
        \\.............o..
        \\o...............
        \\..............oo
        \\................
        \\................
        \\o............o..
        \\..............o.
    );

    try board.shr(64).expect(
        \\o...............
        \\.o..............
        \\..............o.
        \\...............o
        \\o...............
        \\..............o.
        \\.o..............
        \\...............o
        \\o...............
        \\................
        \\.o............o.
        \\...............o
        \\................
        \\................
        \\................
        \\................
    );
}

test "BitBoard.toIndexInteger: 復元可能なインデックスを作成する" {
    const B = BitBoard(16, 16);

    const board = B.fromIndex(5);

    const index_integer = board.toIndexInteger();

    try std.testing.expectEqual(5, index_integer);
    try std.testing.expect(board.eql(B.fromIndex(index_integer)));
}
