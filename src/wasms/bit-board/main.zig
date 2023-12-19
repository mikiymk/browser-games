//!       |  a  b  c  d  e  f  g  h
//!     --+------------------------
//!     8 |  0  1  2  3  4  5  6  7
//!     7 |  8  9 10 11 12 13 14 15
//!     6 | 16 17 18 19 20 21 22 23
//!     5 | 24 25 26 27 28 29 30 31
//!     4 | 32 33 34 35 36 37 38 39
//!     3 | 40 41 42 43 44 45 46 47
//!     2 | 48 49 50 51 52 53 54 55
//!     1 | 56 57 58 59 60 61 62 63

const std = @import("std");
const builtin = @import("builtin");

/// ビットボードの文字列からビットボードを作成する。
/// 第二引数で石を示す文字を指定する。
pub fn fromString(comptime str: []const u8, comptime piece_symbol: u8) u64 {
    comptime var board: u64 = 0;

    comptime {
        if (str.len != 64 + 7) {
            @compileError("invalid length");
        }

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

            if (str[char_count] != '\n') {
                @compileError("invalid character");
            }

            char_count += 1;
        }
    }

    return board;
}

/// 代数式の座標から1マスを表すビットボードを作成する。
///
///     a8 b8 c8 d8 e8 f8 g8 h8
///     a7 b7 c7 d7 e7 f7 g7 h7
///     a6 b6 c6 d6 e6 f6 g6 h6
///     a5 b5 c5 d5 e5 f5 g5 h5
///     a4 b4 c4 d4 e4 f4 g4 h4
///     a3 b3 c3 d3 e3 f3 g3 h3
///     a2 b2 c2 d2 e2 f2 g2 h2
///     a1 b1 c1 d1 e1 f1 g1 h1
pub fn fromNotation(comptime str: []const u8) u64 {
    comptime var board: u64 = 0;

    comptime {
        if (str.len != 2) {
            @compileError("invalid length");
        }

        const rank: u8 = str[0] - 'a';
        const file: u8 = str[1] - '0';

        const index: u11 = rank + (8 - file) * 8;

        board = @as(u64, 1) << index;
    }

    return board;
}

pub fn fromNotations(comptime notations: []const []const u8) u64 {
    var board: u64 = 0;

    inline for (notations) |notation| {
        board |= fromNotation(notation);
    }

    return board;
}

/// ビットボードを文字列に変換する。
/// printデバッグ用
pub fn toString(board: u64, piece_symbol: u8, empty_symbol: u8) [71]u8 {
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

pub fn expectBitBoard(expected: u64, comptime actual: []const u8) error{TestExpectedEqual}!void {
    const actual_bit_board = fromString(actual, 'o');

    if (expected != actual_bit_board) {
        std.debug.print(
            \\
            \\- expected --
            \\{s}
            \\
            \\- actual ----
            \\{s}
            \\
        , .{
            toString(expected, 'o', '.'),
            actual,
        });

        return error.TestExpectedEqual;
    }
}

test "bit-board from string" {
    const testing = std.testing;

    var expected: u64 = 0x00_00_00_00_00_aa_55_aa;
    var actual = fromString(
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

test "bit-board from algebraic notation" {
    const testing = std.testing;

    try testing.expectEqual(fromNotation("a1"), 1 << 56);
    try testing.expectEqual(fromNotation("a8"), 1 << 0);
    try testing.expectEqual(fromNotation("h1"), 1 << 63);
    try testing.expectEqual(fromNotation("h8"), 1 << 7);
}

test "bit-board from algebraic notations" {
    const testing = std.testing;

    try testing.expectEqual(fromNotations(&.{ "a1", "a8", "h1", "h8" }), 0x8100000000000081);
}

test "from string and from notation" {
    const testing = std.testing;

    try testing.expectEqual(fromNotation("a8"), fromString(
        \\o.......
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    , 'o'));
    try testing.expectEqual(fromNotation("h1"), fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\.......o
    , 'o'));
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
    var actual = toString(0x00_00_00_00_00_aa_55_aa, 'o', '.');

    try testing.expectEqualStrings(expected, &actual);
}
