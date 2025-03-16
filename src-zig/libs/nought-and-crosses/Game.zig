const std = @import("std");
const builtin = @import("builtin");
const common = @import("../common/main.zig");
const nought_and_cross = @import("main.zig");
const Game = nought_and_cross.Game;
const BitBoard = nought_and_cross.BitBoard;

pub const Position = struct {
    x: u32,
    y: u32,

    pub fn from(index: usize) Position {
        return .{
            .x = index % 3,
            .y = index / 3,
        };
    }
};
pub const Color = enum(u1) {
    white,
    black,

    pub fn turn(color: Color) Color {
        return switch (color) {
            .white => .black,
            .black => .white,
        };
    }
};

boards: BitBoard,
next_color: Color,

pub fn init() Game {
    return .{
        .boards = BitBoard.init(
            \\...
            \\...
            \\...
        ),
        .next_color = .white,
    };
}

pub fn getBoard(game: Game, color: Color) u32 {
    return game.boards.get(color).toInteger();
}

pub fn getCurrentPlayer(game: Game) Color {
    return game.next_color;
}

pub fn move(game: *Game, to: usize) void {
    game.boards.set(game.next_color, @intCast(to));
    game.next_color = game.next_color.turn();
}

pub fn ai(game: *Game) void {
    const empty = game.boards.getEmpty();
    const count = empty.count();
    var rand_int = common.random.getRandomIntRange(0, count);
    var it = empty.iterator();
    const move_to = b: while (it.next()) |index| {
        if (rand_int == 0) {
            break :b index;
        }
        rand_int -= 1;
    } else unreachable;

    game.move(move_to);
}
