const std = @import("std");
const builtin = @import("builtin");

const draughts = @import("libs/english-draughts/main.zig");
const Game = draughts.Game;
const Color = Game.Color;

// common import
const common = @import("libs/common/main.zig");
const a = common.allocator;

/// ゲームを開始する
export fn init() ?*Game {
    const game = a.create(Game) catch return null;
    game.* = Game.init(a) catch return null;

    return game;
}

/// ゲームを終了する
export fn deinit(game: *Game) void {
    game.deinit(a);
    a.destroy(game);
}

/// ボードの状態を得る
export fn getBoard(game: *Game, color: Color) u32 {
    return game.getBoard(color).toInteger();
}

/// 現在のプレイヤーの色を得る
export fn getColor(game: *Game) Color {
    return game.getColor();
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
