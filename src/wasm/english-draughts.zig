const std = @import("std");
const builtin = @import("builtin");

const draughts = @import("libs/english-draughts/main.zig");
const Game = draughts.Game;

// common import
const common = @import("libs/common/main.zig");
const a = common.allocator;

/// ゲームを開始する
export fn init() ?*Game {
    const game_ptr = a.create(Game) catch return null;
    game_ptr.* = Game.init(a) catch return null;

    return game_ptr;
}

/// ゲームを終了する
export fn deinit(game_ptr: ?*Game) void {
    if (game_ptr) |g| {
        g.deinit(a);
        a.destroy(g);
    }
}

/// ボードの状態を得る
export fn getBoard() void {
    @panic("no");
}

/// 現在のプレイヤーの色を得る
export fn getColor() void {
    @panic("no");
}

/// ボードの位置を指定して可能な移動先を得る
export fn getMove() void {
    @panic("no");
}

/// 移動元と移動先を指定して移動する。
/// 移動後、次のプレイヤーを切り替える。
export fn move() void {
    @panic("no");
}

/// 自動で移動させる。
export fn ai() void {
    @panic("no");
}
