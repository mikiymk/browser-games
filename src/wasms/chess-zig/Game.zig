const std = @import("std");
const Board = @import("Board.zig");
const Color = Board.Color;
const PieceType = Board.PieceType;

const Game = @This();

pub const Move = struct {
    pub const MoveKindEnum = enum { move, promotion, enpassant, castling };
    pub const MoveKind = union(MoveKindEnum) {
        /// 通常の移動
        /// 値は常に0
        move: u0,
        /// ポーンのプロモーション
        /// 値はプロモーション先の駒
        promotion: PieceType,
        /// アンパサン
        /// 値は常に0
        enpassant: u0,
        /// キャスリング
        /// 値はキングまたはクイーン
        castling: PieceType,
    };

    kind: MoveKind,

    /// 移動する駒の種類
    piece_type: PieceType,
    /// 移動元の位置
    from: u64,
    /// 移動先の位置
    to: u64,

    /// 取る駒の種類
    capture_piece_type: ?PieceType = null,
    /// 取る駒の位置
    capture: u64 = 0,
};

const Castling = struct {
    kingside: bool = true,
    queenside: bool = true,
};

const BoardMap = std.hash_map.AutoHashMap(Board, void);

/// 現在の盤の状態
board: Board,
/// 次の手番の色
next_color: Color,

/// アンパサンが可能ならその位置、それ以外では0
enpassant_target: u64,
/// キャスリングが可能かどうか
castling_available: struct {
    black: Castling,
    white: Castling,
},
/// 50手ルールのためのカウント
move_clock: u32,
/// 3回繰り返しルールのための過去の盤の状態
previous_boards: BoardMap,

pub fn init(allocator: std.mem.Allocator) Game {
    return .{
        .board = Board.init(),
        .next_color = .white,

        .enpassant_target = 0,
        .castling_available = .{ .black = .{}, .white = .{} },
        .move_clock = 0,
        .previous_boards = BoardMap.init(allocator),
    };
}

pub fn end(game: Game) bool {
    return game.board.isCheckmate(.black) or game.board.isCheckmate(.white);
}
