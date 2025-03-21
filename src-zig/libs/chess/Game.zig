// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import
const main = @import("./main.zig");
const Game = main.Game;
const Board = main.Board;
const ColorPieceType = Board.ColorPieceType;
const Color = Board.Color;
const PieceType = Board.PieceType;
const moves = main.moves;

// test import
test {
    _ = @import("./Game.test.zig");
}

pub const Result = enum {
    NoEnds,
    BlackWin,
    WhiteWin,
    Stalemate,
    SeventyFiveMoves,
    FivefoldRepetition,
    InsufficientMaterial,
};

const BoardMap = std.hash_map.AutoHashMap(Board, u8);

/// 現在の盤の状態
board: Board,
/// 次の手番の色
next_color: Color,

/// 50手ルールのためのカウント
move_clock: u32,
/// 3回繰り返しルールのための過去の盤の状態
previous_boards: BoardMap,

// ここから関数

/// ゲームを作成する。
/// ゲームが終了したらdeinit()を呼び出す。
pub fn init(allocator: std.mem.Allocator) Game {
    return .{
        .board = Board.init(),
        .next_color = .white,

        .move_clock = 0,
        .previous_boards = BoardMap.init(allocator),
    };
}

/// ゲームを終了する。
pub fn deinit(game: *Game) void {
    game.previous_boards.deinit();
    game.* = undefined;
}

/// 現在のゲームボードの1マスを指定し、その位置にいる駒の移動先を得る。
/// キャスリング、アンパサンも含める。
pub fn getMove(game: Game, from: BitBoard) BitBoard {
    if (game.board.getColor(from) != game.next_color) {
        return BitBoard.init();
    }

    return game.board.getMove(from);
}

/// 現在のゲームボードの移動元と移動先を指定し、移動元にある駒を移動先に移動させる。
/// 移動先にあるその他の駒はすべて取り除かれる。
pub fn applyMove(game: *Game, from: BitBoard, to: BitBoard) bool {
    const new_board = game.board.getMovedBoard(from, to);
    const is_promotion = game.board.isPromotion(from, to);

    // 前回のボード状態をカウントアップする
    const prev_board_count = game.previous_boards.get(game.board) orelse 0;
    game.previous_boards.put(game.board, prev_board_count + 1) catch {};

    // ポーンを動かすか駒を取る動きならカウントをリセット、それ以外でカウントアップ
    if (game.board.getType(from) == .pawn or game.board.getColorType(to) != null) {
        game.move_clock = 0;
    } else {
        game.move_clock += 1;
    }

    game.board = new_board;
    game.next_color = game.next_color.turn();

    return is_promotion;
}

/// 現在のゲームボードの1マスと変化する駒の種類を指定し、プロモーション(成り)をする。
pub fn applyPromote(game: *Game, place: BitBoard, piece_type: PieceType) void {
    game.board = game.board.getPromotionBoard(place, piece_type);
}

/// ゲームの勝利を判定する。
/// まだ勝敗がついていない場合はnull
pub fn ends(game: Game, color: Color) Result {
    if (game.move_clock >= 75) {
        // 75手ルール
        return .SeventyFiveMoves;
    }

    // 5回繰り返しルール
    var iter = game.previous_boards.iterator();
    while (iter.next()) |entry| {
        if (entry.value_ptr.* >= 5) {
            return .FivefoldRepetition;
        }
    }

    if (!game.board.canMove(color)) {
        if (game.board.isChecked(color)) {
            // チェック状態ならチェックメイト
            return switch (color) {
                .black => .WhiteWin,
                .white => .BlackWin,
            };
        } else {
            // チェック状態でないならステイルメイト
            return .Stalemate;
        }
    }

    if (game.board.isInsufficientMaterial()) {
        // 駒が足りない状態
        return .InsufficientMaterial;
    }

    return .NoEnds;
}
