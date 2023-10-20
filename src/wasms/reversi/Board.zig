const std = @import("std");

// 1 << n
//
//  63 62 61 60 59 58 57 56
//  55 54 53 52 51 50 49 48
//  47 46 45 44 43 42 41 40
//  39 38 37 36 35 34 33 32
//  31 30 29 28 27 26 25 24
//  23 22 21 20 19 18 17 16
//  15 14 13 12 11 10  9  8
//   7  6  5  4  3  2  1  0

const Board = @This();

// properties

black: u64 = 0,
white: u64 = 0,
nextColor: Color = .black,

pub const Color = enum { black, white };

pub fn init() Board {
    return comptime fromString(
        \\........
        \\........
        \\........
        \\...xo...
        \\...ox...
        \\........
        \\........
        \\........
    );
}

pub fn getPlayer(b: *const Board) u64 {
    return switch (b.nextColor) {
        .black => b.black,
        .white => b.white,
    };
}

pub fn getOpponent(b: *const Board) u64 {
    return switch (b.nextColor) {
        .black => b.white,
        .white => b.black,
    };
}

/// find a place to put it.
/// - b - board pointer
/// - isBlack - if next place player is black
pub fn move(b: *Board, place: u6) void {
    _ = b;
    _ = place;
    @panic("not implemented yet");
}

pub fn getValidMoves(b: *const Board) u64 {
    const player_board = b.getPlayer();
    const opponent_board = b.getOpponent();

    const mask: u64 = opponent_board & comptime bit_board.fromString(
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
    , 'o');

    return (getDirMoves(player_board, mask, 1) |
        getDirMoves(player_board, opponent_board, 8) |
        getDirMoves(player_board, mask, 7) |
        getDirMoves(player_board, mask, 9)) &
        ~(player_board | opponent_board);
}

fn getDirMoves(board: u64, mask: u64, dir: u6) u64 {
    var line_board: u64 = board;
    line_board = ((line_board << dir) | (line_board >> dir)) & mask;
    line_board |= ((line_board << dir) | (line_board >> dir)) & mask;
    line_board |= ((line_board << dir) | (line_board >> dir)) & mask;
    line_board |= ((line_board << dir) | (line_board >> dir)) & mask;
    line_board |= ((line_board << dir) | (line_board >> dir)) & mask;
    line_board |= ((line_board << dir) | (line_board >> dir)) & mask;
    return (line_board << dir) | (line_board >> dir);
}

test "get valid move" {
    const testing = std.testing;

    // 現在のボード状態
    const board = comptime fromString(
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
    const mask: u64 = board.white & comptime bit_board.fromString(
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
    , &bit_board.toString(mask, 'x', '.'));

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
    , &bit_board.toString(flip, 'o', '.'));

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
    , &bit_board.toString(flip, 'o', '.'));

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
    , &bit_board.toString(flip, 'o', '.'));

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
    , &bit_board.toString(flip, 'o', '.'));

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
    , &bit_board.toString(flip, 'o', '.'));

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
    , &bit_board.toString(flip, 'o', '.'));

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
    , &bit_board.toString(moves, 'o', '.'));
}

test "get valid move 1" {
    const testing = std.testing;

    const board = comptime fromString(
        \\.ox.....
        \\........
        \\........
        \\.oxxx...
        \\........
        \\......ox
        \\........
        \\oxxxxxx.
    );
    const actual = bit_board.toString(board.getValidMoves(), 'o', '.');

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

    const board = comptime fromString(
        \\.o...x..
        \\.x.o.o.x
        \\...x...x
        \\...x...x
        \\...x...x
        \\o......x
        \\.......x
        \\.......o
    );
    const actual = bit_board.toString(board.getValidMoves(), 'o', '.');

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

    const board = comptime fromString(
        \\o.......
        \\.x...o..
        \\..x...x.
        \\...x....
        \\....x...
        \\.x...x..
        \\..x...x.
        \\o..o....
    );
    const actual = bit_board.toString(board.getValidMoves(), 'o', '.');

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

    const board = comptime fromString(
        \\..x.....
        \\.x....x.
        \\o....x..
        \\....x..o
        \\...x..x.
        \\..x..x..
        \\.x..x...
        \\o.......
    );
    const actual = bit_board.toString(board.getValidMoves(), 'o', '.');

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

pub fn isEnd(b: *const Board) bool {
    _ = b;
    @panic("not implemented yet");
}

fn fromString(comptime str: []const u8) Board {
    return .{
        .black = bit_board.fromString(str, 'o'),
        .white = bit_board.fromString(str, 'x'),
    };
}

const bit_board = struct {
    fn fromString(comptime str: []const u8, piece_symbol: u8) u64 {
        if (!@inComptime() and @import("builtin").mode != .Debug) {
            @compileError("bit-board.fromString is use only debug or comptime");
        }

        comptime {
            if (str.len != 64 + 7) {
                @compileError("invalid length");
            }

            for (1..8) |i| {
                if (str[9 * i - 1] != '\n') {
                    @compileError("invalid character");
                }
            }
        }

        var board: u64 = 0;

        var char_count: u8 = 0;
        var bit_count: u6 = 0;
        for (0..8) |n| {
            for (0..8) |_| {
                const char = str[char_count];

                if (char == piece_symbol) {
                    board |= @as(u64, 1) << bit_count;
                }

                char_count += 1;
                bit_count +|= 1;
            }

            if (n == 7) {
                break;
            }

            char_count += 1;
        }

        return board;
    }

    fn toString(board: u64, piece_symbol: u8, empty_symbol: u8) [71]u8 {
        var str: [64 + 7]u8 = .{0} ** (64 + 7);

        var char_count: u8 = 0;
        var bit_count: u6 = 0;
        for (0..8) |l| {
            for (0..8) |_| {
                if (board & @as(u64, 1) << bit_count != 0) {
                    str[char_count] = piece_symbol;
                } else {
                    str[char_count] = empty_symbol;
                }

                char_count += 1;
                bit_count +|= 1;
            }

            if (l == 7) {
                break;
            }

            str[char_count] = '\n';
            char_count += 1;
        }

        return str;
    }
};

test "bit-board from string" {
    const testing = std.testing;

    var expected: u64 = 0x00_00_00_00_00_aa_55_aa;
    var actual = comptime bit_board.fromString(
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\........
        \\........
        \\x.x.x.x.
        \\.x.x.x.x
        \\x.x.x.x.
    , 'o');

    try testing.expectEqualDeep(expected, actual);
}

test "bit-board to string" {
    const testing = std.testing;

    var expected =
        \\.o.o.o.o
        \\o.o.o.o.
        \\.o.o.o.o
        \\........
        \\........
        \\........
        \\........
        \\........
    ;
    var actual = comptime bit_board.toString(0x00_00_00_00_00_aa_55_aa, 'o', '.');

    try testing.expectEqualStrings(expected, &actual);
}

test "board from string" {
    const testing = std.testing;

    var expected = Board{
        .black = 0x00_00_00_00_00_aa_55_aa,
        .white = 0x55_aa_55_00_00_00_00_00,
    };
    var actual = comptime fromString(
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
