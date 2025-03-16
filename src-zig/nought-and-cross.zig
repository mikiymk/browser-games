const std = @import("std");
const builtin = @import("builtin");
const common = @import("libs/common/main.zig");
const nougut_and_cross = @import("libs/nought-and-crosses/main.zig");
const Game = nougut_and_cross.Game;
const allocator = common.allocator;

/// ゲームのインスタンスを作成する
export fn init() ?*Game {
    const game = allocator.create(Game) catch return null;
    game.* = Game.init();
    return game;
}
