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
    const mask = board.white.masks(BitBoard.fromString(
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
    , 'o'));

    try testing.expectEqualStrings(
        \\...x..x.
        \\.x.x.x..
        \\..xxx...
        \\.xx.xxx.
        \\...x....
        \\.x.x.x..
        \\.xxxxxx.
        \\........
    , &mask.toString('x', '.'));

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
    , &flip.toString('o', '.'));

    // dirで決められた方向に向けて石を置く
    // 正の方向と負の方向の2方向を同時に進める
    flip = flip.shl(dir).unions(flip.shr(dir)).masks(mask);

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\..o.o...
        \\........
        \\........
        \\......o.
        \\........
    , &flip.toString('o', '.'));

    // さらに進めたものを前回のものとORで重ねる
    flip.setUnion(flip.shl(dir).unions(flip.shr(dir)).masks(mask));

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\.oo.oo..
        \\........
        \\........
        \\.....oo.
        \\........
    , &flip.toString('o', '.'));

    // 合計で6回進める
    flip.setUnion(flip.shl(dir).unions(flip.shr(dir)).masks(mask));
    flip.setUnion(flip.shl(dir).unions(flip.shr(dir)).masks(mask));
    flip.setUnion(flip.shl(dir).unions(flip.shr(dir)).masks(mask));
    flip.setUnion(flip.shl(dir).unions(flip.shr(dir)).masks(mask));

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\.oo.ooo.
        \\........
        \\........
        \\.oooooo.
        \\........
    , &flip.toString('o', '.'));

    // 最後にマスクなしで進める
    // 自分の石の隣に相手の石が繋がっているものの一番先頭

    flip = flip.shl(dir).unions(flip.shr(dir));

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\oooooooo
        \\........
        \\........
        \\oooooooo
        \\........
    , &flip.toString('o', '.'));

    // これを「石が置かれていない場所」でマスク
    flip = flip.excludes(board.black.unions(board.white));

    try testing.expectEqualStrings(
        \\........
        \\........
        \\........
        \\o.......
        \\........
        \\........
        \\o.......
        \\........
    , &flip.toString('o', '.'));

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
    , &moves.toString('o', '.'));
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
    const actual = board.getValidMoves().toString('o', '.');

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
    const actual = board.getValidMoves().toString('o', '.');

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
    const actual = board.getValidMoves().toString('o', '.');

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
    const actual = board.getValidMoves().toString('o', '.');

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

    const expected = Board{
        .black = BitBoard.fromInteger(0x00_00_00_00_00_aa_55_aa),
        .white = BitBoard.fromInteger(0x55_aa_55_00_00_00_00_00),
    };
    const actual = Board.fromString(
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
