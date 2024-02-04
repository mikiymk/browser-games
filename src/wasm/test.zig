const std = @import("std");

test {
    const testing = std.testing;

    testing.refAllDecls(@This());

    _ = @import("libs/bit-board/main.zig");
    _ = @import("libs/reversi/ai.zig");
    _ = @import("libs/reversi/Board.zig");
    _ = @import("libs/chess/Game_test.zig");
    _ = @import("libs/chess/Board_test.zig");
    _ = @import("libs/chess/moves_test.zig");
    _ = @import("libs/common/main.zig");
}
