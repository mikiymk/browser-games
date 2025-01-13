const std = @import("std");
const builtin = @import("builtin");

pub const ai = @import("./ai.zig");
pub const Board = @import("./Board.zig");

test {
    _ = ai;
    _ = Board;
}
