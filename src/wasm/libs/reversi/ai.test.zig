// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import
const Board = @import("./Board.zig");
const ai = @import("./ai.zig");

test "get random move with AI" {
    const testing = std.testing;

    const board = Board.fromString(
        \\........
        \\........
        \\........
        \\...ox...
        \\...xo...
        \\........
        \\........
        \\........
    );

    const expected: u64 = comptime BitBoard.fromString(
        \\........
        \\........
        \\....o...
        \\.....o..
        \\..o.....
        \\...o....
        \\........
        \\........
    , 'o');

    const S = struct {
        var rand_gen: std.rand.DefaultPrng = undefined;
        var rand: std.rand.Random = undefined;

        fn random() f64 {
            return rand.float(f64);
        }
    };

    for (0..11) |i| {
        S.rand_gen = std.rand.DefaultPrng.init(i);
        S.rand = S.rand_gen.random();

        const actual = @as(u64, 1) << ai.getAiMove(board, S.random);

        testing.expect(actual & expected != 0) catch {
            const print = std.debug.print;
            const boardToString = BitBoard.toString;

            print("expected {x:0>16}\n{s}\n\n", .{ expected, boardToString(expected, 'o', '.') });
            print("actual {x:0>16}\n{s}\n\n", .{ actual, boardToString(actual, 'o', '.') });

            return error.UnexpectedBoard;
        };
    }
}
