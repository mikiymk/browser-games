const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;

const draughts = @import("../english-draughts/main.zig");
const Game = draughts.Game;
const Board = draughts.Board;
const BitBoard = draughts.BitBoard;

// common import
const common = @import("../common/main.zig");
const log = common.console.log;

// # 最初のボード状態

// .x.x.x.x
// x.x.x.x.
// .x.x.x.x
// ........
// ........
// o.o.o.o.
// .o.o.o.o
// o.o.o.o.

// # 動き方
// - 単純な移動: 斜め前方に1マス移動する
// - ジャンプ: 斜め前方に相手の駒を飛び越える。 ジャンプされた駒は捕獲される。

// ジャンプが可能な場合は強制される。
// ジャンプの後にジャンプできる場合はマルチジャンプが可能。
// 複数のマルチジャンプが利用可能な場合、プレーヤーはどのジャンプを行うかを選択できる。

// # キング
// 駒がボードの相手側のキング列に移動すると、キングとして後ろに移動する能力を獲得する。
// 昇格した場合はマルチジャンプができない。

// # 勝ち条件
// - 対戦相手のすべての駒を捕獲する
// - 対戦相手が有効な動きを持たない

pub const Color = enum(u8) {
    /// 先に動かすプレイヤー
    /// ボードの下側
    /// テキスト表示はo
    white = 0b0001,

    /// 後に動かすプレイヤー
    /// ボードの上側
    /// テキスト表示はx
    black = 0b0011,

    /// ターンを返す
    pub fn turn(self: @This()) @This() {
        return switch (self) {
            .black => .white,
            .white => .black,
        };
    }

    pub fn parse(number: usize) Color {
        return @enumFromInt(@as(u8, @truncate(number)) & 0b0011);
    }
};

pub const Piece = enum(u8) {
    pawn = 0b0001,
    king = 0b0101,

    pub fn parse(number: usize) Piece {
        return @enumFromInt(@as(u8, @truncate(number)) & 0b0101);
    }
};

pub const Move = union(enum) {
    walk: struct { position_from: BitBoard, position_to: BitBoard },
    jump: struct { position_from: BitBoard, position_to: BitBoard, position_jumped: BitBoard },

    /// 移動元と移動先から移動アクションを作成する。
    /// 1マス空きの場合は間のマスを計算する。
    /// position_fromとposition_toはインデックスで指定する。
    pub fn init(position_from: usize, position_to: usize) Move {
        const position_from_board = BitBoard.initWithIndex(position_from);
        const position_to_board = BitBoard.initWithIndex(position_to);

        const diff = if (position_from > position_to) position_from - position_to else position_to - position_from;

        // もし縦の差+1(斜め移動)より大きい場合、2マスジャンプとして扱う。
        if (diff > BitBoard.height + 1) {
            const position_jumped = BitBoard.initWithIndex((position_from + position_to) / 2);

            return .{
                .jump = .{
                    .position_from = position_from_board,
                    .position_to = position_to_board,
                    .position_jumped = position_jumped,
                },
            };
        }

        return .{
            .walk = .{
                .position_from = position_from_board,
                .position_to = position_to_board,
            },
        };
    }

    pub fn eql(a: Move, b: Move) bool {
        return switch (a) {
            .walk => |aw| b == .walk and aw.position_from.eql(b.walk.position_from) and aw.position_to.eql(b.walk.position_to),
            .jump => |aj| b == .jump and aj.position_from.eql(b.jump.position_from) and aj.position_to.eql(b.jump.position_to) and aj.position_jumped.eql(b.jump.position_jumped),
        };
    }

    pub fn format(value: @This(), comptime fmt: []const u8, options: std.fmt.FormatOptions, writer: anytype) !void {
        _ = fmt;
        _ = options;

        switch (value) {
            .jump => |j| {
                try writer.print(".jump ({d}, {d}) ({d}, {d}) ({d}, {d})", .{
                    j.position_from.toCoordinate().x,
                    j.position_from.toCoordinate().y,
                    j.position_to.toCoordinate().x,
                    j.position_to.toCoordinate().y,
                    j.position_jumped.toCoordinate().x,
                    j.position_jumped.toCoordinate().y,
                });
            },
            .walk => |w| {
                try writer.print(".walk ({d}, {d}) ({d}, {d})", .{
                    w.position_from.toCoordinate().x,
                    w.position_from.toCoordinate().y,
                    w.position_to.toCoordinate().x,
                    w.position_to.toCoordinate().y,
                });
            },
        }
    }
};

test Move {
    {
        const move = Move.init(
            BitBoard.initWithCoordinate(3, 3).toIndexInteger(),
            BitBoard.initWithCoordinate(4, 4).toIndexInteger(),
        );

        try std.testing.expect(move == .walk);
        try std.testing.expect(move.walk.position_from.eql(BitBoard.initWithCoordinate(3, 3)));
        try std.testing.expect(move.walk.position_to.eql(BitBoard.initWithCoordinate(4, 4)));
    }

    {
        const move = Move.init(
            BitBoard.initWithCoordinate(5, 3).toIndexInteger(),
            BitBoard.initWithCoordinate(3, 5).toIndexInteger(),
        );

        try std.testing.expect(move == .jump);
        try std.testing.expect(move.jump.position_from.eql(BitBoard.initWithCoordinate(5, 3)));
        try std.testing.expect(move.jump.position_to.eql(BitBoard.initWithCoordinate(3, 5)));
        try std.testing.expect(move.jump.position_jumped.eql(BitBoard.initWithCoordinate(4, 4)));
    }
}

board: Board,

next_color: Color,

/// ゲームを作成する
pub fn init(a: Allocator) !Game {
    return .{
        .board = Board.initWithString(a,
            \\.x.x.x.x
            \\x.x.x.x.
            \\.x.x.x.x
            \\........
            \\........
            \\o.o.o.o.
            \\.o.o.o.o
            \\o.o.o.o.
        ),
        .next_color = .white,
    };
}

/// ゲームを終了する。
pub fn deinit(self: Game, a: Allocator) void {
    _ = self;
    _ = a;
}

/// 指定した色のボード状態を取得する
pub fn getBoard(self: Game, color: Color, piece: Piece) BitBoard {
    return self.board.getBoard(color, piece);
}

/// 次に動かすプレイヤーの色を取得する
pub fn getColor(self: Game) Color {
    return self.next_color;
}

/// 指定した駒の移動できる位置を取得する
pub fn getMove(self: Game, a: Allocator, position: BitBoard) BitBoard {
    const color, const piece = self.board.getColorPiece(position) orelse return BitBoard.init();
    const jump_moves = switch (piece) {
        .pawn => self.board.movedPawnJump(position),
        .king => self.board.movedKingJump(position),
    };

    // ジャンプ可能ならジャンプを返す
    if (!jump_moves.isEmpty()) {
        return jump_moves;
    }

    // 盤上にジャンプできる駒がある場合、通常移動はできない
    const all_jump_moves = self.board.getAllJumpMoves(a, color) catch return BitBoard.init();
    if (all_jump_moves.len != 0) {
        return BitBoard.init();
    }

    return switch (piece) {
        .pawn => self.board.movedPawnWalk(position),
        .king => self.board.movedKingWalk(position),
    };
}

/// 指定された移動を実行し、ゲーム状態を更新する。
/// 移動先でさらにジャンプできる場合はtrueを返す。
pub fn setMoved(self: *Game, move_action: Move) bool {
    switch (move_action) {
        .walk => |w| {
            // ポーンが昇格したら追加ジャンプできない
            const is_promote = self.board.setMovedWalk(
                w.position_from,
                w.position_to,
            );
            const can_jump = !self.board.movedKingJump(w.position_to).isEmpty();

            return !is_promote and can_jump;
        },
        .jump => |j| {
            self.board.setMovedJump(
                j.position_from,
                j.position_to,
                j.position_jumped,
            );

            return !self.board.movedKingJump(j.position_to).isEmpty();
        },
    }
}
