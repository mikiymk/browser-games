const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;

// common import
const common = @import("../common/main.zig");

pub const Game = @import("Game.zig");
pub const Board = @import("Board.zig");
pub const ai = @import("ai.zig");
pub const BitBoard = common.bit_board.BitBoard(8, 8);

test {
    std.testing.refAllDeclsRecursive(@This());
}
