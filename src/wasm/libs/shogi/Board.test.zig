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

test "Board.init: 初期状態のボードを作成する" {
    const board = Board.init();

    try BitBoard.expect(board.black_king_general,
        \\....o....
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.white_step_soldier,
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\ooooooooo
        \\.........
        \\.........
    );
}

test "Board.fromString: 初期状態のボードを作成する" {
    const board = Board.fromString(
        \\lnsgkgtom
        \\.r.h.d.b.
        \\ppppqqqqq
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_king_general,
        \\....o....
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_fly_car,
        \\.........
        \\.o.......
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_dragon_king,
        \\.........
        \\.....o...
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_corner_line,
        \\.........
        \\.......o.
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_dragon_horse,
        \\.........
        \\...o.....
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_gold_general,
        \\...o.o...
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_silver_general,
        \\..o......
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_promoted_silver_general,
        \\......o..
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_cinnamon_horse,
        \\.o.......
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_promoted_cinnamon_horse,
        \\.......o.
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_incense_car,
        \\o........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_promoted_incense_car,
        \\........o
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_step_soldier,
        \\.........
        \\.........
        \\oooo.....
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.black_to_gold,
        \\.........
        \\.........
        \\....ooooo
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );
}

test "Board.getPieceAt: 駒の種類を取得する" {
    const board = Board.init();

    try std.testing.expectEqual(Game.Square.white_silver_general, board.getPieceAt(BitBoard.fromString(
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\......o..
    , 'o')));
}

test "Board.getColorPieces: プレイヤーの駒のすべての位置を取得する" {
    const board = Board.init();

    try BitBoard.expect(board.getColorPieces(.black),
        \\ooooooooo
        \\.o.....o.
        \\ooooooooo
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.getColorPieces(.white),
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\ooooooooo
        \\.o.....o.
        \\ooooooooo
    );
}
