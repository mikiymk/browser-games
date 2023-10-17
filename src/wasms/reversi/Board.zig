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
    return .{
        .black = 0b00000000_00000000_00000000_00001000_00010000_00000000_00000000_00000000,
        .white = 0b00000000_00000000_00000000_00010000_00001000_00000000_00000000_00000000,
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

pub fn getValidMoves(b: *Board) u64 {
    _ = b;
    @panic("not implemented yet");
}

pub fn isEnd(b: *Board) bool {
    _ = b;
    @panic("not implemented yet");
}

fn createBitBoardFromString(comptime str: []const u8, piece_symbol: u8) u64 {
    var board = 0;

    if (str.len != 64 + 7) {
        @compileError("invalid length");
    }

    var char_count = 0;
    var bit_count = 0;
    for (0..8) |n| {
        for (0..8) |_| {
            const char = str[char_count];

            if (char == piece_symbol) {
                board |= 1 << bit_count;
            }

            char_count += 1;
            bit_count += 1;
        }

        if (n == 7) {
            break;
        }

        if (str[char_count] != '\n') {
            @compileError("invalid character");
        }

        char_count += 1;
    }

    return board;
}

fn createBoardFromString(comptime str: []const u8) Board {
    return .{
        .black = createBitBoardFromString(str, 'o'),
        .white = createBitBoardFromString(str, 'x'),
    };
}

test "createBitBoardFromString" {
    const testing = std.testing;

    var expected = Board{
        .black = 0x00_00_00_00_00_aa_55_aa,
        .white = 0x55_aa_55_00_00_00_00_00,
    };
    var actual = comptime createBoardFromString(
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
