const std = @import("std");
const builtin = @import("builtin");

const draughts = @import("libs/english-draughts/main.zig");
const Game = draughts.Game;
const Color = Game.Color;
const BitBoard = draughts.BitBoard;

// common import
const common = @import("libs/common/main.zig");
const a = common.allocator;
const getRandom = common.random.getRandom;

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
export fn getBoard(game: *Game, color: Color) u64 {
    return game.getBoard(color).toInteger();
}

/// 現在のプレイヤーの色を得る
export fn getColor(game: *Game) Color {
    return game.getColor();
}

/// ボードの位置を指定して可能な移動先を得る
export fn getMove(game: *Game, position_index: usize) u64 {
    const position = BitBoard.fromIndex(position_index);

    const moves = game.getMove(position);
    return moves.toInteger();
}

/// 移動元と移動先を指定して移動する。
/// 移動後、次のプレイヤーを切り替える。
/// 移動先でさらにジャンプできる場合はtrueを返す。
export fn move(game: *Game, position_from: usize, position_to: usize) bool {
    const color = game.board.getColor(BitBoard.fromIndex(position_from)) orelse return false;
    const action = Game.Move.init(position_from, position_to, color);
    const can_jump = game.setMoved(action);
    game.next_color = game.next_color.turn();
    return can_jump;
}

/// 自動で移動させる。
export fn ai(game: *Game) void {
    draughts.ai.ai(a, game) catch {};
    game.next_color = game.next_color.turn();
}
