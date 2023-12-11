const std = @import("std");
const bit_board = @import("bit-board");
const Board = @import("Board.zig");
const ColorPieceType = Board.ColorPieceType;
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

// ここから関数

/// ゲームを作成する。
/// ゲームが終了したらdeinit()を呼び出す。
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

/// ゲームを終了する。
pub fn deinit(game: *Game) void {
    game.previous_boards.deinit();
    game.* = undefined;
}

/// 現在のゲームボードの1マスを指定し、その位置にいる駒の移動先を得る。
/// キャスリング、アンパサンも含める。
pub fn getMove(game: Game, from: u64) u64 {
    var board = game.board.getMove(from);

    // キャスリング
    if (from == bit_board.fromNotation("e1")) {
        if (game.castling_available.black.kingside and game.board.canCastling(.black_king)) {
            board |= bit_board.fromNotation("h1");
        }
        if (game.castling_available.black.queenside and game.board.canCastling(.black_queen)) {
            board |= bit_board.fromNotation("a1");
        }
    } else if (from == bit_board.fromNotation("e8")) {
        if (game.castling_available.white.kingside and game.board.canCastling(.white_king)) {
            board |= bit_board.fromNotation("h8");
        }
        if (game.castling_available.white.queenside and game.board.canCastling(.white_queen)) {
            board |= bit_board.fromNotation("a8");
        }
    }

    // アンパサン
    switch (game.next_color) {
        .black => if (from & game.board.black_pawn != 0 and
            (from >> 7 | from >> 9) & game.enpassant_target != 0)
        {
            board |= game.enpassant_target;
        },
        .white => if (from & game.board.white_pawn != 0 and
            (from << 7 | from << 9) & game.enpassant_target != 0)
        {
            board |= game.enpassant_target;
        },
    }

    return board;
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
