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

    try board.getBoard(.black, .king).expect(
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

    try board.getBoard(.white, .pawn).expect(
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

    try board.getBoard(.black, .king).expect(
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

    try board.getBoard(.black, .rook).expect(
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

    try board.getBoard(.black, .rook_promoted).expect(
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

    try board.getBoard(.black, .bishop).expect(
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

    try board.getBoard(.black, .bishop_promoted).expect(
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

    try board.getBoard(.black, .gold).expect(
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

    try board.getBoard(.black, .silver).expect(
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

    try board.getBoard(.black, .silver_promoted).expect(
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

    try board.getBoard(.black, .knight).expect(
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

    try board.getBoard(.black, .knight_promoted).expect(
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

    try board.getBoard(.black, .lance).expect(
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

    try board.getBoard(.black, .lance_promoted).expect(
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

    try board.getBoard(.black, .pawn).expect(
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

    try board.getBoard(.black, .pawn_promoted).expect(
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

    try moved_board.getBoard(.white, .pawn).expect(
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

    try moved_board.getBoard(.white, .pawn).expect(
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

    try moved_board.getBoard(.white, .pawn_promoted).expect(
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

    try moved_board.getBoard(.white, .knight).expect(
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

    try board.getColorPieces(.black).expect(
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

    try board.getColorPieces(.white).expect(
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

    try board.movePositions(BitBoard.fromCoordinate(2, 2)).expect(
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

    try board.movePositions(BitBoard.fromCoordinate(1, 7)).expect(
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

    try board.hitPositions(.white, .bishop).expect(
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

    try board.hitPositions(.white, .knight).expect(
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

    try board.filterMove(.black, from, to).expect(
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
