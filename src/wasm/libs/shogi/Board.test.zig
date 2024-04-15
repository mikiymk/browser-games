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

    try BitBoard.expect(board.black_king,
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

    try BitBoard.expect(board.white_pawn,
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

    try BitBoard.expect(board.black_king,
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

    try BitBoard.expect(board.black_rook,
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

    try BitBoard.expect(board.black_rook_promoted,
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

    try BitBoard.expect(board.black_bishop,
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

    try BitBoard.expect(board.black_bishop_promoted,
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

    try BitBoard.expect(board.black_gold,
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

    try BitBoard.expect(board.black_silver,
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

    try BitBoard.expect(board.black_silver_promoted,
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

    try BitBoard.expect(board.black_knight,
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

    try BitBoard.expect(board.black_knight_promoted,
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

    try BitBoard.expect(board.black_lance,
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

    try BitBoard.expect(board.black_lance_promoted,
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

    try BitBoard.expect(board.black_pawn,
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

    try BitBoard.expect(board.black_pawn_promoted,
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

    try std.testing.expectEqual(Game.Square.white_silver, board.getPieceAt(BitBoard.fromString(
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

test "Board.movedBoard: 駒を動かした後のボードを取得する" {
    const board = Board.init();

    const moved_board = board.movedBoard(
        BitBoard.fromCoordinate(2, 2),
        BitBoard.fromCoordinate(2, 3),
    );

    try BitBoard.expect(moved_board.white_pawn,
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\..o......
        \\oo.oooooo
        \\.........
        \\.........
    );
}

test "Board.promotedBoard: 駒が成った後のボードを取得する" {
    const board = Board.init();

    const moved_board = board.promotedBoard(
        BitBoard.fromCoordinate(2, 2),
    );

    try BitBoard.expect(moved_board.white_pawn,
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\oo.oooooo
        \\.........
        \\.........
    );

    try BitBoard.expect(moved_board.white_pawn_promoted,
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\..o......
        \\.........
        \\.........
    );
}

test "Board.hitBoard: 駒を打った後のボードを取得する" {
    const board = Board.init();

    const moved_board = board.hitBoard(
        .white,
        .knight,
        BitBoard.fromCoordinate(4, 4),
    );

    try BitBoard.expect(moved_board.white_knight,
        \\.........
        \\.........
        \\.........
        \\.........
        \\....o....
        \\.........
        \\.........
        \\.........
        \\.o.....o.
    );
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

test "Board.movePositions: 指定した位置の駒の行ける場所を取得する" {
    const board = Board.init();

    try BitBoard.expect(board.movePositions(BitBoard.fromCoordinate(2, 2)),
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\..o......
        \\.........
        \\.........
        \\.........
    );

    try BitBoard.expect(board.movePositions(BitBoard.fromCoordinate(1, 7)),
        \\.........
        \\o.ooooo..
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
    );
}

test "Board.hitPositions: 指定した駒の打てる場所を取得する" {
    const board = Board.init();

    try BitBoard.expect(board.hitPositions(.white, .bishop),
        \\.........
        \\o.ooooo.o
        \\.........
        \\ooooooooo
        \\ooooooooo
        \\ooooooooo
        \\.........
        \\o.ooooo.o
        \\.........
    );

    try BitBoard.expect(board.hitPositions(.white, .knight),
        \\.........
        \\.........
        \\.........
        \\ooooooooo
        \\ooooooooo
        \\ooooooooo
        \\.........
        \\o.ooooo.o
        \\.........
    );
}

test "Board.filterMove: 自分が王手になる移動を除外する" {
    const board = Board.fromString(
        \\....k....
        \\.........
        \\....r....
        \\.........
        \\.........
        \\.........
        \\.........
        \\.........
        \\....L....
    );

    const from = BitBoard.fromCoordinate(4, 6);
    const to = board.movePositions(from);

    try BitBoard.expect(board.filterMove(.black, from, to),
        \\.........
        \\....o....
        \\.........
        \\....o....
        \\....o....
        \\....o....
        \\....o....
        \\....o....
        \\....o....
    );
}

test "Board.isAttacked: そのマスが攻撃されているか判定する" {
    const board = Board.fromString(
        \\.........
        \\.........
        \\.........
        \\.........
        \\....r....
        \\.........
        \\.........
        \\.........
        \\.........
    );

    try std.testing.expect(board.isAttacked(BitBoard.fromCoordinate(4, 2), .white));
    try std.testing.expect(!board.isAttacked(BitBoard.fromCoordinate(5, 2), .white));
}

test "Board.isChecked: 王将・玉将が攻撃されているか判定する" {
    const board = Board.fromString(
        \\.........
        \\....K....
        \\.........
        \\.........
        \\....r....
        \\.........
        \\.........
        \\....k....
        \\.........
    );

    try std.testing.expect(board.isChecked(.white));
    try std.testing.expect(!board.isChecked(.black));
}

test "Board.isCheckmated: 王手にされているか判定する" {
    const board = Board.fromString(
        \\.........
        \\....k....
        \\....G....
        \\....P....
        \\.........
        \\....p....
        \\....g....
        \\....K....
        \\r........
    );

    try std.testing.expect(board.isCheckmated(.white));
    try std.testing.expect(!board.isCheckmated(.black));
}
