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

pub fn end(game: Game) bool {
    return game.board.isCheckmate(.black) or game.board.isCheckmate(.white);
}
