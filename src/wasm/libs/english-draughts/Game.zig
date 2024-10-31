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
};

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
