const std = @import("std");
const builtin = @import("builtin");
const common = @import("../common/main.zig");
const nougut_and_cross = @import("main.zig");
const Game = nougut_and_cross.Game;
const Board = nougut_and_cross.Board;

board: Board,

pub fn init() Game {
    return .{
        .board = Board.init(),
    };
}
