// std import
const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;
const AllocError = Allocator.Error;

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import
const main = @import("./main.zig");
const Board = main.Board;
const Color = Board.Color;
