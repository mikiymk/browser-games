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

/// find a place to put it.
/// - b - board pointer
/// - isBlack - if next place player is black
pub fn move(b: *Board, place: u6) void {
    _ = b;
    _ = place;
    @panic("not implemented yet");
}

pub fn getValidMoves(b: *Board) u64 {
    _ = b;
    @panic("not implemented yet");
}

pub fn isEnd(b: *Board) bool {
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
        var board: u64 = 0;

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
