const std = @import("std");
const testing = std.testing;
const bit_board = @import("bit-board");
const Game = @import("Game.zig");
const Board = @import("Board.zig");

const allocator = testing.allocator_instance.allocator();
