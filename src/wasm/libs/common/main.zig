const std = @import("std");
const builtin = @import("builtin");

pub const types = @import("./types.zig");
pub const bit_board = @import("./bit-board.zig");

test {
    std.testing.refAllDeclsRecursive(@This());
}
