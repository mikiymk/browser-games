const std = @import("std");
const builtin = @import("builtin");
const shogi = @import("libs/shogi/main.zig");
const common = @import("libs/common/main.zig");
const a = common.allocator;

/// ゲームを作成する
/// メモリが足りない場合はnullを返す
export fn init() ?*shogi.Game {
    const game_ptr = a.create(shogi.Game) catch return null;
    game_ptr.* = shogi.Game.init();

    return game_ptr;
}

/// ゲームを削除する
/// メモリを解放する
export fn deinit(game: *shogi.Game) void {
    a.destroy(game);
}

/// ボードのメモリを作成する
export fn initBoard() ?[*]u8 {
    const board_ptr = a.alloc(u8, 81) catch return null;
    for (board_ptr) |*square| {
        square.* = 0;
    }

    return board_ptr.ptr;
}

/// ボードのメモリを解放する
export fn deinitBoard(board: [*]u8) void {
    a.free(board[0..81]);
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
    return @intFromEnum(game.getWinner() orelse return 0);
}

/// 持ち駒の数を得る
export fn hands(game: *shogi.Game, hands_ptr: [*]u8) void {
    var hands_slice = hands_ptr[0..16];
    @memset(hands_slice, 0);

    hands_slice[0] = game.white_hands.get(.king);
    hands_slice[1] = game.white_hands.get(.rook);
    hands_slice[2] = game.white_hands.get(.bishop);
    hands_slice[3] = game.white_hands.get(.gold);
    hands_slice[4] = game.white_hands.get(.silver);
    hands_slice[5] = game.white_hands.get(.knight);
    hands_slice[6] = game.white_hands.get(.lance);
    hands_slice[7] = game.white_hands.get(.pawn);

    hands_slice[8] = game.black_hands.get(.king);
    hands_slice[9] = game.black_hands.get(.rook);
    hands_slice[10] = game.black_hands.get(.bishop);
    hands_slice[11] = game.black_hands.get(.gold);
    hands_slice[12] = game.black_hands.get(.silver);
    hands_slice[13] = game.black_hands.get(.knight);
    hands_slice[14] = game.black_hands.get(.lance);
    hands_slice[15] = game.black_hands.get(.pawn);
}

/// 選択したマスの駒の動ける範囲を得る
export fn movePos(game: *shogi.Game, board: [*]u8, from: u8) void {
    const positions = game.movePositions(shogi.Board.BitBoard.initWithIndex(from));
    var board_slice: []u8 = board[0..81];

    @memset(board_slice, 0);

    shogi.Game.setPieceToBoard(&board_slice, positions, 1);
}

/// 選択した駒の打てる場所を得る
export fn hitPos(game: *shogi.Game, board: [*]u8, piece: u8) void {
    const positions = game.hitPositions(@enumFromInt(piece));
    var board_slice: []u8 = board[0..81];

    @memset(board_slice, 0);

    shogi.Game.setPieceToBoard(&board_slice, positions, 1);
}

/// 移動元と移動先を指定して駒を動かす
/// 成りを選択できる場合はtrueを返す
export fn move(game: *shogi.Game, from: u8, to: u8) bool {
    return game.move(shogi.Board.BitBoard.initWithIndex(from), shogi.Board.BitBoard.initWithIndex(to));
}

export fn hit(game: *shogi.Game, piece: u8, to: u8) void {
    game.hit(@enumFromInt(piece), shogi.Board.BitBoard.initWithIndex(to));
}

/// 移動元と変化先の駒を指定して駒を動かす
export fn promote(game: *shogi.Game, position: u8) void {
    game.promote(shogi.Board.BitBoard.initWithIndex(position));
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
