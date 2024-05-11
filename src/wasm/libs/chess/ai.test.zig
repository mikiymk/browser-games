// std import
const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;
const AllocError = Allocator.Error;

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import
const main = @import("./main.zig");
const Board = main.Board;
const Color = Board.Color;
const ai = main.ai;

test "get random move with AI" {
    const allocator = std.testing.allocator;
    const board = Board.init();

    const S = struct {
        var rand_gen: std.rand.DefaultPrng = undefined;
        var rand: std.rand.Random = undefined;

        fn random() f64 {
            return rand.float(f64);
        }
    };

    for (0..11) |_| {
        S.rand_gen = std.rand.DefaultPrng.init(0);
        S.rand = S.rand_gen.random();

        const move = try ai.getAiMove(board, allocator, .white, 1, S.random);

        try move.from.expectJoint(
            \\........
            \\........
            \\........
            \\........
            \\........
            \\........
            \\oooooooo
            \\oooooooo
        );

        try move.to.expectJoint(
            \\........
            \\........
            \\........
            \\........
            \\oooooooo
            \\oooooooo
            \\........
            \\........
        );
    }
}
