const std = @import("std");
const builtin = @import("builtin");
const common = @import("../common/main.zig");
const nought_and_cross = @import("main.zig");
const Game = nought_and_cross.Game;
const BitBoard = nought_and_cross.BitBoard;

pub const Color = enum(u1) {
    white = 0,
    black = 1,

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

pub fn winner(game: *Game) ?Color {
    if (game.isWin(.white)) return .white;
    if (game.isWin(.black)) return .black;
    return null;
}

const win_lines = b: {
    const win_lines_str = [_][]const u8{
        "ooo\n...\n...",
        "...\nooo\n...",
        "...\n...\nooo",
        "o..\no..\no..",
        ".o.\n.o.\n.o.",
        "..o\n..o\n..o",
        "o..\n.o.\n..o",
        "..o\n.o.\no..",
    };
    var lines = [_]BitBoard.BitBoard{undefined} ** win_lines_str.len;
    for (win_lines_str, &lines) |str, *line| {
        line.* = BitBoard.BitBoard.fromString(str, 'o');
    }
    break :b lines;
};

pub fn isWin(game: Game, color: Color) bool {
    const board = game.boards.get(color);
    for (win_lines) |line| {
        if (board.masks(line).eql(line)) return true;
    }
    return false;
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
