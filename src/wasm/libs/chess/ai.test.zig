// std import
const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;
const AllocError = Allocator.Error;

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);
const getRandom = common.random.getRandom;

// internal import
const main = @import("./main.zig");
const Board = main.Board;
const Color = Board.Color;
const ai = main.ai;

test "📖ai.getAiMove: AIの考えた動き" {
    const allocator = std.testing.allocator;
    const board = Board.init();

    for (0..11) |_| {
        const move = try ai.getAiMove(board, allocator, .white, 1, getRandom);

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
