const std = @import("std");
const builtin = @import("builtin");
const shogi = @import("libs/shogi/main.zig");
const common = @import("libs/common/main.zig");

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
export fn deinit(game: *shogi.Game) void {
    allocator.destroy(game);
}

/// ボードのメモリを作成する
export fn initBoard() ?[*]u8 {
    const board_ptr = allocator.alloc(u8, 81) catch return null;
    for (board_ptr) |*square| {
        square.* = 0;
    }

    return board_ptr.ptr;
}

/// ボードのメモリを解放する
export fn deinitBoard(board: [*]u8) void {
    allocator.free(board[0..81]);
}

/// ボードのメモリを設定する
export fn setBoard(game: *shogi.Game, board: [*]u8) void {
    var board_slice: []u8 = board[0..81];
    game.setBoard(&board_slice);
}

/// 現在のプレイヤーの種類を得る
export fn player(game: *shogi.Game) u8 {
    return @intFromEnum(game.current_player);
}

/// 勝利したプレイヤーの種類を得る
export fn winner(game: *shogi.Game) u8 {
    return @intFromEnum(game.getWinner() orelse return 255);
}

/// 選択したマスの駒の動ける範囲を得る
export fn movePoses(game: *shogi.Game, board: [*]u8, from: u8) void {
    const positions = game.movePositions(indexToBoardBits(from));
    var board_slice: []u8 = board[0..81];

    @memset(board_slice, 0);

    shogi.Game.setPieceToBoard(&board_slice, positions, 1);
}

/// 移動元と移動先を指定して駒を動かす
/// 成りを選択できる場合はtrueを返す
export fn move(game: *shogi.Game, from: u8, to: u8) bool {
    return game.move(indexToBoardBits(from), indexToBoardBits(to));
}

export fn hit(game: *shogi.Game, piece: u8, to: u8) void {
    game.hit(@enumFromInt(piece), indexToBoardBits(to));
}

/// 移動元と変化先の駒を指定して駒を動かす
export fn promote(game: *shogi.Game, position: u8) void {
    game.promote(indexToBoardBits(position));
}

/// AIで自動で駒を動かす
export fn moveAi(game: *shogi.Game) void {
    const ai_move = shogi.ai.move(game.*, common.random.random);

    switch (ai_move) {
        .move => |m| {
            const promotion = game.move(m.from, m.to);
            if (promotion) {
                game.promote(m.to);
            }
        },
        .hit => |h| {
            game.hit(h.piece, h.to);
        },
    }
}

fn indexToBoardBits(position: u8) u81 {
    return @as(u81, 1) << @truncate(position);
}
