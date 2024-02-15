const std = @import("std");
const builtin = @import("builtin");
const shogi = @import("libs/shogi/main.zig");

/// アロケーター
const allocator = if (builtin.target.isWasm()) std.heap.wasm_allocator else std.heap.page_allocator;

/// ゲームを作成する
/// メモリが足りない場合はnullを返す
export fn init() ?*shogi.Game {
    const game_ptr = allocator.create(shogi.Game) catch return null;
    game_ptr.* = shogi.Game.init();

    return game_ptr;
}

/// ゲームを削除する
/// メモリを解放する
export fn deinit(game_ptr: ?*shogi.Game) void {
    if (game_ptr) |gp| {
        allocator.destroy(gp);
    }
}

/// ボードのメモリを作成する
export fn initBoard() ?[*]u8 {
    var board_ptr = allocator.alloc(u8, 81) catch return null;
    for (board_ptr) |*square| {
        square.* = 0;
    }

    return board_ptr.ptr;
}

/// ボードのメモリを解放する
export fn deinitBoard(board: ?[*]u8) void {
    if (board) |b| {
        allocator.free(b[0..81]);
    }
}

/// ボードのメモリを設定する
export fn setBoard(game_ptr: ?*shogi.Game, board: ?[*]u8) void {
    if (game_ptr) |gp| {
        if (board) |b| {
            _ = gp;
            _ = b;
        }
    }

    @panic("not implement yet");
}

/// プレイヤーの種類を得る
export fn player(game_ptr: ?*shogi.Game) u8 {
    _ = game_ptr;

    @panic("not implement yet");
}

/// 勝利したプレイヤーの種類を得る
export fn winner(game_ptr: ?*shogi.Game) u8 {
    _ = game_ptr;

    @panic("not implement yet");
}

/// 選択したマスの駒の動ける範囲を得る
export fn movePoses(game_ptr: ?*shogi.Game, board: ?[*]u8, from: u8) void {
    _ = game_ptr;
    _ = board;
    _ = from;

    @panic("not implement yet");
}

/// 移動元と移動先を指定して駒を動かす
/// 成りを選択できる場合はtrueを返す
export fn move(game_ptr: ?*shogi.Game, from: u8, to: u8) bool {
    _ = game_ptr;
    _ = from;
    _ = to;

    @panic("not implement yet");
}

/// 移動元と変化先の駒を指定して駒を動かす
export fn promote(game_ptr: ?*shogi.Game, from: u8, piece: u8) void {
    _ = game_ptr;
    _ = from;
    _ = piece;

    @panic("not implement yet");
}

/// AIで自動で駒を動かす
export fn moveAi(game_ptr: ?*shogi.Game) void {
    _ = game_ptr;

    @panic("not implement yet");
}
