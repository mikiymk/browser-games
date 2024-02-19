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

        .white_incense_car => getWhiteLanceMovable(board, from),
        .black_incense_car => getBlackLanceMovable(board, from),

        .white_cinnamon_horse => getWhiteKnightMovable(board, from),
        .black_cinnamon_horse => getBlackKnightMovable(board, from),

        else => 0,
    };
}

/// 先手の歩兵の移動できる範囲
pub fn getWhitePawnMovable(board: Board, from: u81) u81 {
    const to: u81 = BitBoard.move(from, .n);
    const ally_pieces = board.getColorPieces(.white);

    return to & ~ally_pieces;
}

/// 後手の歩兵の移動できる範囲
pub fn getBlackPawnMovable(board: Board, from: u81) u81 {
    const to: u81 = BitBoard.move(from, .s);
    const ally_pieces = board.getColorPieces(.black);

    return to & ~ally_pieces;
}

/// 先手の香車の移動できる範囲
pub fn getWhiteLanceMovable(board: Board, from: u81) u81 {
    const ally_pieces = board.getColorPieces(.white);
    const enemy_pieces = board.getColorPieces(.black);
    const empty_squares = ~(ally_pieces | enemy_pieces);

    var to = from;

    for (0..7) |_| {
        to |= BitBoard.move(to, .n) & empty_squares;
    }

    return BitBoard.move(to, .n) & ~ally_pieces;
}

/// 後手の香車の移動できる範囲
pub fn getBlackLanceMovable(board: Board, from: u81) u81 {
    const ally_pieces = board.getColorPieces(.black);
    const enemy_pieces = board.getColorPieces(.white);
    const empty_squares = ~(ally_pieces | enemy_pieces);

    var to = from;

    for (0..7) |_| {
        to |= BitBoard.move(to, .s) & empty_squares;
    }

    return BitBoard.move(to, .s) & ~ally_pieces;
}

/// 先手の桂馬の移動できる範囲
pub fn getWhiteKnightMovable(board: Board, from: u81) u81 {
    const to_nne: u81 = BitBoard.move(BitBoard.move(from & east_mask, .ne), .n);
    const to_nnw: u81 = BitBoard.move(BitBoard.move(from & west_mask, .nw), .n);
    const ally_pieces = board.getColorPieces(.white);

    return (to_nne | to_nnw) & ~ally_pieces;
}

/// 後手の桂馬の移動できる範囲
pub fn getBlackKnightMovable(board: Board, from: u81) u81 {
    const to_sse: u81 = BitBoard.move(BitBoard.move(from & east_mask, .se), .s);
    const to_ssw: u81 = BitBoard.move(BitBoard.move(from & west_mask, .sw), .s);
    const ally_pieces = board.getColorPieces(.black);

    return (to_sse | to_ssw) & ~ally_pieces;
}
