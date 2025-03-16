const std = @import("std");
const builtin = @import("builtin");
const common = @import("../common/main.zig");
const nougut_and_cross = @import("main.zig");
const Game = nougut_and_cross.Game;
const Board = nougut_and_cross.Board;
const BitBoard = common.bit_board.BitBoard(3, 3);

pub fn init() Game {
    return .{};
}
