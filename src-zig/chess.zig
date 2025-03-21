const std = @import("std");
const builtin = @import("builtin");

const chess = @import("libs/chess/main.zig");
const Board = chess.Board;
const Game = chess.Game;
const ai = chess.ai;
const ColorPieceType = Board.ColorPieceType;

// common import
const common = @import("libs/common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);
const a = common.allocator;

/// ゲームを作成する
export fn init() ?*Game {
    const game_ptr = a.create(Game) catch return null;
    game_ptr.* = Game.init(a);

    return game_ptr;
}

/// ゲームを削除する
export fn deinit(g: ?*Game) void {
    if (g) |game_ptr| {
        a.destroy(game_ptr);
    }
}

/// ボードに駒を配置する
export fn setPiece(g: *Game, kind: ColorPieceType, index: u8) void {
    g.board.setPiece(kind, BitBoard.fromIndex(index));
}

/// ボードの駒を取得する
export fn getPiece(g: *Game, kind: ColorPieceType) u64 {
    return g.board.getPieces(kind).toInteger();
}

/// 今のターンが黒かどうか
export fn isBlack(g: *Game) bool {
    return g.next_color == .black;
}

/// ゲームが終了しているかどうか
export fn isEnd(g: *Game) bool {
    return g.ends(g.next_color) != .NoEnds;
}

/// ゲームが終了している場合、勝利者を判定する
export fn winner(g: *Game) u8 {
    return @intFromEnum(g.ends(g.next_color));
}

/// 駒を選択し、その駒の移動先を取得する
export fn getMove(g: *Game, from_index: u8) u64 {
    const from_place = BitBoard.fromIndex(from_index);

    return g.getMove(from_place).toInteger();
}

/// 駒を移動する
/// アンパサン、キャスリングを判別する
/// 戻り値はプロモーションが可能かどうか
export fn move(g: *Game, from_index: u8, to_index: u8) bool {
    const from = BitBoard.fromIndex(from_index);
    const to = BitBoard.fromIndex(to_index);

    return g.applyMove(from, to);
}

/// 駒のプロモーション
export fn promote(g: *Game, index: u8, piece_kind: ColorPieceType) void {
    const place = BitBoard.fromIndex(index);
    g.applyPromote(place, piece_kind.pieceType());
}

/// AIで駒を移動する
export fn moveAi(g: *Game) void {
    const ai_move = ai.getAiMove(g.board, a, g.next_color, 3) catch return;

    if (g.applyMove(ai_move.from, ai_move.to)) {
        g.applyPromote(ai_move.to, .queen);
    }
}
