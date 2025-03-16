const std = @import("std");
const builtin = @import("builtin");
const common = @import("../common/main.zig");
const nougut_and_cross = @import("main.zig");
const Game = nougut_and_cross.Game;
const Board = nougut_and_cross.Board;

pub const Position = struct {
    x: u32,
    y: u32,

    pub fn from(index: usize) Position {
        return .{
            .x = index % 3,
            .y = index / 3,
        };
    }
};
pub const Color = enum(u1) {
    white,
    black,
};

board: Board,

pub fn init() Game {
    return .{
        .board = Board.init(),
    };
}

pub fn deinit(game: *Game) void {
    game.board.deinit();
}

pub fn getBoard(game: Game, color: Color) u32 {
    _ = game;
    _ = color;
    return 0;
}

pub fn getCurrentPlayer(game: Game) Color {
    _ = game;
    return .white;
}

pub fn move(game: *Game, from: Position, to: Position) void {
    _ = game;
    _ = from;
    _ = to;
}

pub fn ai(game: *Game) void {
    _ = game;
}
