// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import
const Board = @import("./Board.zig");

test "move black" {
    const testing = std.testing;

    var board = Board.fromString(
        \\o..o..o.
        \\.x.x.x..
        \\..xxx...
        \\oxx.xxxo
        \\..xxx...
        \\.x.x.x..
        \\o..x..x.
        \\...o...o
    );

    const place = BitBoard.fromString(
        \\........
        \\........
        \\........
        \\...o....
        \\........
        \\........
        \\........
        \\........
    , 'o');

    const expected = Board.fromString(
        \\o..o..o.
        \\.o.o.o..
        \\..ooo...
        \\oooooooo
        \\..ooo...
        \\.o.o.o..
        \\o..o..o.
        \\...o...o
    );

    board.moveMutate(place);

    try testing.expectEqualDeep(expected, board);
}

test "get valid move" {
    const testing = std.testing;

    // 現在のボード状態
    const board = Board.fromString(
        \\...x..x.
        \\.x.x.x..
        \\..xxx...
        \\.xxoxxxx
        \\...x....
        \\.x.x.x..
        \\.xxxxxxo
        \\........
    );

    // マスク
    // 相手の石があるところだけ + 端をループしないように止める
    const mask: u64 = board.white & BitBoard.fromString(
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
    , 'o');

    try testing.expectEqualStrings(
        \\...x..x.
        \\.x.x.x..
        \\..xxx...
        \\.xx.xxx.
        \\...x....
        \\.x.x.x..
        \\.xxxxxx.
        \\........
    , &BitBoard.toString(mask, 'x', '.'));

    var flip = board.black;
    const dir = 1;

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\...o....
        \\........
        \\........
        \\.......o
        \\........
    , &BitBoard.toString(flip, 'o', '.'));

    // dirで決められた方向に向けて石を置く
    // 正の方向と負の方向の2方向を同時に進める
    flip = ((flip << dir) | (flip >> dir)) & mask;

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\..o.o...
        \\........
        \\........
        \\......o.
        \\........
    , &BitBoard.toString(flip, 'o', '.'));

    // さらに進めたものを前回のものとORで重ねる
    flip |= ((flip << dir) | (flip >> dir)) & mask;

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\.oo.oo..
        \\........
        \\........
        \\.....oo.
        \\........
    , &BitBoard.toString(flip, 'o', '.'));

    // 合計で6回進める
    flip |= ((flip << dir) | (flip >> dir)) & mask;
    flip |= ((flip << dir) | (flip >> dir)) & mask;
    flip |= ((flip << dir) | (flip >> dir)) & mask;
    flip |= ((flip << dir) | (flip >> dir)) & mask;

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\.oo.ooo.
        \\........
        \\........
        \\.oooooo.
        \\........
    , &BitBoard.toString(flip, 'o', '.'));

    // 最後にマスクなしで進める
    // 自分の石の隣に相手の石が繋がっているものの一番先頭

    flip = (flip << dir) | (flip >> dir);

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\oooooooo
        \\........
        \\........
        \\oooooooo
        \\........
    , &BitBoard.toString(flip, 'o', '.'));

    // これを「石が置かれていない場所」でマスク
    flip = flip & ~(board.black | board.white);

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\o.......
        \\........
        \\........
        \\o.......
        \\........
    , &BitBoard.toString(flip, 'o', '.'));

    // これを縦横斜めの4方向に向ける
    const moves = board.getValidMoves();

    try testing.expectEqualStrings(
        \\o.......
        \\........
        \\........
        \\o.......
        \\........
        \\........
        \\o.......
        \\...o....
    , &BitBoard.toString(moves, 'o', '.'));
}

test "get valid move 1" {
    const testing = std.testing;

    const board = Board.fromString(
        \\.ox.....
        \\........
        \\........
        \\.oxxx...
        \\........
        \\......ox
        \\........
        \\oxxxxxx.
    );
    const actual = BitBoard.toString(board.getValidMoves(), 'o', '.');

    const expected =
        \\...o....
        \\........
        \\........
        \\.....o..
        \\........
        \\........
        \\........
        \\.......o
    ;

    try testing.expectEqualStrings(expected, &actual);
}

test "get valid move 2" {
    const testing = std.testing;

    const board = Board.fromString(
        \\.o...x..
        \\.x.o.o.x
        \\...x...x
        \\...x...x
        \\...x...x
        \\o......x
        \\.......x
        \\.......o
    );
    const actual = BitBoard.toString(board.getValidMoves(), 'o', '.');

    const expected =
        \\.......o
        \\........
        \\.o......
        \\........
        \\........
        \\...o....
        \\........
        \\........
    ;

    try testing.expectEqualStrings(expected, &actual);
}

test "get valid move 3" {
    const testing = std.testing;

    const board = Board.fromString(
        \\o.......
        \\.x...o..
        \\..x...x.
        \\...x....
        \\....x...
        \\.x...x..
        \\..x...x.
        \\o..o....
    );
    const actual = BitBoard.toString(board.getValidMoves(), 'o', '.');

    const expected =
        \\........
        \\........
        \\........
        \\.......o
        \\o.......
        \\........
        \\........
        \\.......o
    ;

    try testing.expectEqualStrings(expected, &actual);
}

test "get valid move 4" {
    const testing = std.testing;

    const board = Board.fromString(
        \\..x.....
        \\.x....x.
        \\o....x..
        \\....x..o
        \\...x..x.
        \\..x..x..
        \\.x..x...
        \\o.......
    );
    const actual = BitBoard.toString(board.getValidMoves(), 'o', '.');

    const expected =
        \\.......o
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\...o....
    ;

    try testing.expectEqualStrings(expected, &actual);
}

test "game is end" {
    const testing = std.testing;

    const board = Board.fromString(
        \\oooooooo
        \\xxxxxxxx
        \\oooooooo
        \\xxxxxxxx
        \\oooooooo
        \\xxxxxxxx
        \\oooooooo
        \\xxxxxxxx
    );

    const actual = board.isEnd();
    const expected = true;

    try testing.expectEqual(expected, actual);
}

test "game is not end" {
    const testing = std.testing;

    const board = Board.fromString(
        \\oooooooo
        \\xxxxxxxx
        \\oooooooo
        \\xxxxxxxx
        \\ooo.oooo
        \\xxxxxxxx
        \\oooooooo
        \\xxxxxxxx
    );

    const actual = board.isEnd();
    const expected = false;

    try testing.expectEqual(expected, actual);
}

test "board from string" {
    const testing = std.testing;

    var expected = Board{
        .black = 0x00_00_00_00_00_aa_55_aa,
        .white = 0x55_aa_55_00_00_00_00_00,
    };
    var actual = Board.fromString(
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\........
        \\........
        \\x.x.x.x.
        \\.x.x.x.x
        \\x.x.x.x.
    );

    try testing.expectEqualDeep(expected, actual);
}
