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
