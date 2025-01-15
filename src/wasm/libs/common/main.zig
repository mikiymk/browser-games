const std = @import("std");
const builtin = @import("builtin");

pub const types = @import("./types.zig");
pub const bit_board = @import("./bit-board.zig");
pub const random = @import("./random.zig");
pub const console = @import("./console.zig");
pub const allocator = if (builtin.target.isWasm()) std.heap.wasm_allocator else std.heap.page_allocator;

test {
    _ = types;
    _ = bit_board;
    _ = random;
    _ = console;
}
