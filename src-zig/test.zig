const std = @import("std");

test {
    _ = @import("libs/common/main.zig");
    _ = @import("libs/reversi/main.zig");
    _ = @import("libs/chess/main.zig");
    _ = @import("libs/shogi/main.zig");
    _ = @import("libs/english-draughts/main.zig");
}
