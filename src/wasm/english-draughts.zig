const std = @import("std");
const builtin = @import("builtin");

const draughts = @import("libs/english-draughts/main.zig");
const Game = draughts.Game;

// common import
const common = @import("libs/common/main.zig");

/// アロケーター
const allocator = if (builtin.target.isWasm()) std.heap.wasm_allocator else std.heap.page_allocator;

/// ゲームを開始する
export fn init() ?*Game {
    const ptr = allocator.create(Game) catch return null;
    ptr.* = .{};

    return ptr;
}

export fn deinit() void {
    @panic("no");
}

export fn getBoard() void {
    @panic("no");
}

export fn getColor() void {
    @panic("no");
}

export fn getMove() void {
    @panic("no");
}

export fn move() void {
    @panic("no");
}

export fn ai() void {
    @panic("no");
}
