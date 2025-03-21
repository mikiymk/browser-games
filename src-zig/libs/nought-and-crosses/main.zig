const std = @import("std");
const builtin = @import("builtin");
const common = @import("../common/main.zig");

pub const Game = @import("Game.zig");
pub const EnumBitBoard = @import("EnumBitBoard.zig").EnumBitBoard;
pub const BitBoard = EnumBitBoard(3, 3, Game.Color, .{
    .white = 'o',
    .black = 'x',
});
