const Board = @import("Board.zig");
const Color = Board.Color;

const Game = @This();

board: Board,
next_color: Color,

pub fn init() Game {
    return .{
        .board = Board.init(),
        .next_color = .white,
    };
}
