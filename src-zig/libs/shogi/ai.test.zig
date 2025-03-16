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
const Game = main.Game;
const ai = main.ai;

test "get random move with AI" {
    const board = Game.init();

    for (0..11) |_| {
        var rand_gen = std.Random.DefaultPrng.init(0);

        const move = ai.move(board, rand_gen.random());

        switch (move) {
            .move => |m| {
                try m.from.expectJoint(
                    \\.........
                    \\.........
                    \\.........
                    \\.........
                    \\.........
                    \\.........
                    \\ooooooooo
                    \\.o.....o.
                    \\ooooooooo
                );

                try m.to.expectJoint(
                    \\.........
                    \\.........
                    \\.........
                    \\.........
                    \\.........
                    \\ooooooooo
                    \\.........
                    \\o.ooooo.o
                    \\.........
                );
            },

            else => return error.ExpectMove,
        }
    }
}
