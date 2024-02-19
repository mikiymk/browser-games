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
const moves = main.moves;

// test import
test {
    _ = @import("./moves.test.zig");
}

const east_mask = BitBoard.fromString(
    \\oooooooo.
    \\oooooooo.
    \\oooooooo.
    \\oooooooo.
    \\oooooooo.
    \\oooooooo.
    \\oooooooo.
    \\oooooooo.
    \\oooooooo.
, 'o');

const west_mask = BitBoard.fromString(
    \\.oooooooo
    \\.oooooooo
    \\.oooooooo
    \\.oooooooo
    \\.oooooooo
    \\.oooooooo
    \\.oooooooo
    \\.oooooooo
    \\.oooooooo
, 'o');

pub fn getMovablePositions(board: Board, from: u81) u81 {
    const piece = board.getPieceAt(from);
    return switch (piece) {
        .white_step_soldier => getWhitePawnMovable(board, from),
        .black_step_soldier => getBlackPawnMovable(board, from),

        else => 0,
    };
}

/// 先手の歩兵の移動できる範囲
pub fn getWhitePawnMovable(board: Board, from: u81) u81 {
    const to: u81 = BitBoard.move(from, .n);
    const black_pieces = board.getColorPieces(.white);

    return to & ~black_pieces;
}

/// 後手の歩兵の移動できる範囲
pub fn getBlackPawnMovable(board: Board, from: u81) u81 {
    const to: u81 = BitBoard.move(from, .s);
    const black_pieces = board.getColorPieces(.black);

    return to & ~black_pieces;
}
