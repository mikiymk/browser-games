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
    black,

    /// ターンを返す
    pub fn turn(self: @This()) @This() {
        return switch (self) {
            .black => .white,
            .white => .black,
        };
    }
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

pub fn getColor(self: Game) Color {
    return self.next_color;
}
