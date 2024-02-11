const std = @import("std");
const builtin = @import("builtin");

pub const Game = @import("./Game.zig");
pub const Board = @import("./Board.zig");

test {
    std.testing.refAllDeclsRecursive(@This());
}
