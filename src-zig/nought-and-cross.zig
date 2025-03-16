const std = @import("std");
const builtin = @import("builtin");
const common = @import("libs/common/main.zig");
const nought_and_cross = @import("libs/nought-and-crosses/main.zig");
const Game = nought_and_cross.Game;
const allocator = common.allocator;

/// ゲームのインスタンスを作成する
export fn init() ?*Game {
    const game = allocator.create(Game) catch return null;
    game.* = Game.init();
    return game;
}

/// ゲームのインスタンスを破棄する
export fn deinit(game: *Game) void {
    allocator.destroy(game);
}

/// ボードの状態を得る
export fn getBoard(game: *Game, color: usize) u32 {
    return game.getBoard(@enumFromInt(color));
}

/// 現在のプレイヤーを得る
export fn getCurrentPlayer(game: *Game) usize {
    return @intFromEnum(game.getCurrentPlayer());
}

/// ボードに駒を置き、ターンを進める
export fn move(game: *Game, position_to: usize) void {
    game.move(position_to);
}

/// AIを使ってボードに駒を置き、ターンを進める
export fn ai(game: *Game) void {
    game.ai();
}
