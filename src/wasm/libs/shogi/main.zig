const std = @import("std");
const builtin = @import("builtin");

pub const Game = @import("./Game.zig");
pub const Board = @import("./Board.zig");
pub const moves = @import("./moves.zig");

test {
    std.testing.refAllDeclsRecursive(@This());
}
