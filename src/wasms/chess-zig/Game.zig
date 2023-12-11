const std = @import("std");
const bit_board = @import("bit-board");
const Board = @import("Board.zig");
const ColorPieceType = Board.ColorPieceType;
const Color = Board.Color;
const PieceType = Board.PieceType;

const Game = @This();

const BoardMap = std.hash_map.AutoHashMap(Board, void);

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
pub fn getMove(game: Game, from: u64) u64 {
    return game.board.getMove(from, game.next_color);
}

/// 現在のゲームボードの移動元と移動先を指定し、移動元にある駒を移動先に移動させる。
/// 移動先にあるその他の駒はすべて取り除かれる。
pub fn applyMove(game: *Game, from: u64, to: u64) void {
    game.board = game.board.getMovedBoard(from, to);
}

/// 現在のゲームボードの1マスと変化する駒の種類を指定し、プロモーション(成り)をする。
pub fn applyPromote(game: Game, place: u64, piece_type: PieceType) void {
    _ = place;
    _ = piece_type;
    _ = game;
}

pub const Result = enum { BlackWin, WhiteWin, Draw };

/// ゲームの勝利を判定する。
/// まだ勝敗がついていない場合はnull
pub fn win(game: Game) ?Result {
    if (game.board.isCheckmate(.black)) {
        return .BlackWin;
    }
    if (game.board.isCheckmate(.white)) {
        return .WhiteWin;
    }

    return null;
}
