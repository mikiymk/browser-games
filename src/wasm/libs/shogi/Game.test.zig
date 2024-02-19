// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(9, 9);

// internal import
const main = @import("./main.zig");
const Game = main.Game;
const Board = main.Board;

test "Game.setBoard: ボードの情報をリストに変換する" {
    const game = Game.init();
    var board = [_]u8{0} ** 81;
    var board_slice: []u8 = board[0..];

    game.setBoard(&board_slice);

    try std.testing.expectEqualSlices(u8, &[_]u8{
        7,  6,  5,  4,  1,  4,  5,  6,  7,
        0,  2,  0,  0,  0,  0,  0,  3,  0,
        8,  8,  8,  8,  8,  8,  8,  8,  8,
        0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,
        22, 22, 22, 22, 22, 22, 22, 22, 22,
        0,  17, 0,  0,  0,  0,  0,  16, 0,
        21, 20, 19, 18, 15, 18, 19, 20, 21,
    }, &board);
}
