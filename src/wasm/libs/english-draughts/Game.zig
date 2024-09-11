const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;

const draughts = @import("../english-draughts/main.zig");
const Game = draughts.Game;

// common import
const common = @import("../common/main.zig");

pub fn init(a: Allocator) !Game {
    _ = a;

    return .{};
}

pub fn deinit(self: Game, a: Allocator) void {
    _ = self;
    _ = a;
}
