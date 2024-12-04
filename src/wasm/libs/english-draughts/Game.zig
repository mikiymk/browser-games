const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;

const draughts = @import("../english-draughts/main.zig");
const Game = draughts.Game;
const Board = draughts.Board;
const BitBoard = draughts.BitBoard;

// common import
const common = @import("../common/main.zig");

pub const Color = enum(u8) {
    /// 先に動かすプレイヤー
    white = 1,

    /// 後に動かすプレイヤー
    black = 2,

    /// ターンを返す
    pub fn turn(self: @This()) @This() {
        return switch (self) {
            .black => .white,
            .white => .black,
        };
    }
};

pub const Move = union(enum) {
    walk: struct { position_from: BitBoard, position_to: BitBoard, color: Color },
    jump: struct { position_from: BitBoard, position_to: BitBoard, position_jumped: BitBoard, color: Color },

    /// 移動元と移動先から移動アクションを作成する
    /// 1マス空きの場合は間のマスを計算する
    pub fn init(position_from: usize, position_to: usize, color: Color) Move {
        const position_from_board = BitBoard.fromIndex(position_from);
        const position_to_board = BitBoard.fromIndex(position_to);

        const diff = if (position_from > position_to) position_from - position_to else position_to - position_from;

        // もし縦の差+1(斜め移動)より大きい場合、2マスジャンプとして扱う。
        if (diff > BitBoard.height + 1) {
            const position_jumped = BitBoard.fromIndex((position_from + position_to) / 2);

            return .{
                .jump = .{
                    .position_from = position_from_board,
                    .position_to = position_to_board,
                    .position_jumped = position_jumped,
                    .color = color,
                },
            };
        }

        return .{
            .walk = .{
                .position_from = position_from_board,
                .position_to = position_to_board,
                .color = color,
            },
        };
    }
};

test Move {
    {
        const move = Move.init(
            BitBoard.fromCoordinate(3, 3).toIndexInteger(),
            BitBoard.fromCoordinate(4, 4).toIndexInteger(),
            .white,
        );

        try std.testing.expect(move == .walk);
        try std.testing.expect(move.walk.position_from.eql(BitBoard.fromCoordinate(3, 3)));
        try std.testing.expect(move.walk.position_to.eql(BitBoard.fromCoordinate(4, 4)));
        try std.testing.expect(move.walk.color == .white);
    }

    {
        const move = Move.init(
            BitBoard.fromCoordinate(5, 3).toIndexInteger(),
            BitBoard.fromCoordinate(3, 5).toIndexInteger(),
            .white,
        );

        try std.testing.expect(move == .jump);
        try std.testing.expect(move.jump.position_from.eql(BitBoard.fromCoordinate(5, 3)));
        try std.testing.expect(move.jump.position_to.eql(BitBoard.fromCoordinate(3, 5)));
        try std.testing.expect(move.jump.position_jumped.eql(BitBoard.fromCoordinate(4, 4)));
        try std.testing.expect(move.jump.color == .white);
    }
}

board: Board,

next_color: Color,

/// ゲームを作成する
pub fn init(a: Allocator) !Game {
    return .{
        .board = Board.initFromString(a,
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
pub fn getBoard(self: Game, color: Color) BitBoard {
    return self.board.getBoard(color);
}

/// 次に動かすプレイヤーの色を取得する
pub fn getColor(self: Game) Color {
    return self.next_color;
}

/// 指定した駒の移動できる位置を取得する
pub fn getMove(self: Game, position: BitBoard) BitBoard {
    const color = self.board.getColor(position) orelse return BitBoard.init();
    const jump_moves = self.board.getMoveJump(position, color);

    if (jump_moves.isEmpty()) {
        return self.board.getMoveWark(position, color);
    } else {
        return jump_moves;
    }
}

/// 指定された移動を実行し、ゲーム状態を更新する。
/// 移動先でさらにジャンプできる場合はtrueを返す。
pub fn setMoved(self: *Game, move_action: Move) bool {
    switch (move_action) {
        .walk => |w| {
            self.board.setMovedWalk(
                w.position_from,
                w.position_to,
                w.color,
            );

            return !self.board.getMoveJump(w.position_to, w.color).isEmpty();
        },
        .jump => |j| {
            self.board.setMovedJump(
                j.position_from,
                j.position_to,
                j.position_jumped,
                j.color,
            );

            return !self.board.getMoveJump(j.position_to, j.color).isEmpty();
        },
    }
}
