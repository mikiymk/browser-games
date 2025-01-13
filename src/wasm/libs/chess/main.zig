const std = @import("std");
const builtin = @import("builtin");

pub const Game = @import("./Game.zig");
pub const Board = @import("./Board.zig");
pub const moves = @import("./moves.zig");
pub const ai = @import("./ai.zig");

test {
    _ = Game;
    _ = Board;
    _ = moves;
    _ = ai;
}
