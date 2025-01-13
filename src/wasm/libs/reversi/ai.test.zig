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

        const actual = BitBoard.fromIndex(ai.getAiMove(board, S.random));

        try actual.expectJoint(
            \\........
            \\........
            \\....o...
            \\.....o..
            \\..o.....
            \\...o....
            \\........
            \\........
        );
    }
}
