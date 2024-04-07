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

pub fn move(board: Board, from: u81) u81 {
    const piece = board.getPieceAt(from);
    return switch (piece) {
        .white_pawn => whitePawn(board, from),
        .black_pawn => blackPawn(board, from),

        .white_lance => whiteLance(board, from),
        .black_lance => blackLance(board, from),

        .white_knight => whiteKnight(board, from),
        .black_knight => blackKnight(board, from),

        .white_silver => whiteSilver(board, from),
        .black_silver => blackSilver(board, from),

        .white_gold,
        .white_pawn_promoted,
        .white_lance_promoted,
        .white_knight_promoted,
        .white_silver_promoted,
        => whiteGold(board, from),
        .black_gold,
        .black_pawn_promoted,
        .black_lance_promoted,
        .black_knight_promoted,
        .black_silver_promoted,
        => blackGold(board, from),

        .white_bishop => bishop(board, from, .white),
        .black_bishop => bishop(board, from, .white),

        .white_rook => rook(board, from, .white),
        .black_rook => rook(board, from, .black),

        .white_bishop_promoted => promotedBishop(board, from, .white),
        .black_bishop_promoted => promotedBishop(board, from, .black),

        .white_rook_promoted => promotedRook(board, from, .white),
        .black_rook_promoted => promotedRook(board, from, .black),

        .white_king => king(board, from, .white),
        .black_king => king(board, from, .black),

        else => 0,
    };
}

/// 先手の歩兵の移動できる範囲
pub fn whitePawn(board: Board, from: u81) u81 {
    const to: u81 = BitBoard.move(from, .n);
    const ally_pieces = board.getColorPieces(.white);

    return to & ~ally_pieces;
}

/// 後手の歩兵の移動できる範囲
pub fn blackPawn(board: Board, from: u81) u81 {
    const to: u81 = BitBoard.move(from, .s);
    const ally_pieces = board.getColorPieces(.black);

    return to & ~ally_pieces;
}

/// 先手の香車の移動できる範囲
pub fn whiteLance(board: Board, from: u81) u81 {
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
pub fn blackLance(board: Board, from: u81) u81 {
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
pub fn whiteKnight(board: Board, from: u81) u81 {
    const to_nne: u81 = BitBoard.move(BitBoard.move(from & east_mask, .ne), .n);
    const to_nnw: u81 = BitBoard.move(BitBoard.move(from & west_mask, .nw), .n);
    const ally_pieces = board.getColorPieces(.white);

    return (to_nne | to_nnw) & ~ally_pieces;
}

/// 後手の桂馬の移動できる範囲
pub fn blackKnight(board: Board, from: u81) u81 {
    const to_sse: u81 = BitBoard.move(BitBoard.move(from & east_mask, .se), .s);
    const to_ssw: u81 = BitBoard.move(BitBoard.move(from & west_mask, .sw), .s);
    const ally_pieces = board.getColorPieces(.black);

    return (to_sse | to_ssw) & ~ally_pieces;
}

/// 先手の銀将の移動できる範囲
pub fn whiteSilver(board: Board, from: u81) u81 {
    const masked_e = from & east_mask;
    const masked_w = from & west_mask;

    const to_n: u81 = BitBoard.move(from, .n);
    const to_ne: u81 = BitBoard.move(masked_e, .ne);
    const to_nw: u81 = BitBoard.move(masked_w, .nw);
    const to_se: u81 = BitBoard.move(masked_e, .se);
    const to_sw: u81 = BitBoard.move(masked_w, .sw);
    const ally_pieces = board.getColorPieces(.white);

    return (to_n | to_ne | to_nw | to_se | to_sw) & ~ally_pieces;
}

/// 後手の銀将の移動できる範囲
pub fn blackSilver(board: Board, from: u81) u81 {
    const masked_e = from & east_mask;
    const masked_w = from & west_mask;

    const to_s: u81 = BitBoard.move(from, .s);
    const to_ne: u81 = BitBoard.move(masked_e, .ne);
    const to_nw: u81 = BitBoard.move(masked_w, .nw);
    const to_se: u81 = BitBoard.move(masked_e, .se);
    const to_sw: u81 = BitBoard.move(masked_w, .sw);
    const ally_pieces = board.getColorPieces(.black);

    return (to_s | to_ne | to_nw | to_se | to_sw) & ~ally_pieces;
}

/// 先手の金将の移動できる範囲
pub fn whiteGold(board: Board, from: u81) u81 {
    const masked_e = from & east_mask;
    const masked_w = from & west_mask;

    const to_n: u81 = BitBoard.move(from, .n);
    const to_ne: u81 = BitBoard.move(masked_e, .ne);
    const to_nw: u81 = BitBoard.move(masked_w, .nw);
    const to_e: u81 = BitBoard.move(masked_e, .e);
    const to_w: u81 = BitBoard.move(masked_w, .w);
    const to_s: u81 = BitBoard.move(from, .s);
    const ally_pieces = board.getColorPieces(.white);

    return (to_n | to_ne | to_nw | to_e | to_w | to_s) & ~ally_pieces;
}

/// 後手の金将の移動できる範囲
pub fn blackGold(board: Board, from: u81) u81 {
    const masked_e = from & east_mask;
    const masked_w = from & west_mask;

    const to_s: u81 = BitBoard.move(from, .s);
    const to_se: u81 = BitBoard.move(masked_e, .se);
    const to_sw: u81 = BitBoard.move(masked_w, .sw);
    const to_e: u81 = BitBoard.move(masked_e, .e);
    const to_w: u81 = BitBoard.move(masked_w, .w);
    const to_n: u81 = BitBoard.move(from, .n);
    const ally_pieces = board.getColorPieces(.black);

    return (to_s | to_se | to_sw | to_e | to_w | to_n) & ~ally_pieces;
}

/// 先手の角行の移動できる範囲
pub fn bishop(board: Board, from: u81, color: Game.PlayerColor) u81 {
    const ally_pieces = board.getColorPieces(color);
    const enemy_pieces = board.getColorPieces(color.turn());
    const empty_squares = ~(ally_pieces | enemy_pieces);

    const mask = empty_squares & east_mask & west_mask;

    var to_ne_sw = from;
    var to_nw_se = from;

    for (0..7) |_| {
        to_ne_sw |= (BitBoard.move(to_ne_sw, .ne) | BitBoard.move(to_ne_sw, .sw)) & mask;
        to_nw_se |= (BitBoard.move(to_nw_se, .nw) | BitBoard.move(to_nw_se, .se)) & mask;
    }

    to_ne_sw |= (BitBoard.move(to_ne_sw, .ne) & east_mask) | (BitBoard.move(to_ne_sw, .sw) & west_mask);
    to_nw_se |= (BitBoard.move(to_nw_se, .nw) & west_mask) | (BitBoard.move(to_nw_se, .se) & east_mask);

    return (to_ne_sw | to_nw_se) & ~ally_pieces;
}

/// 先手の龍馬の移動できる範囲
pub fn promotedBishop(board: Board, from: u81, color: Game.PlayerColor) u81 {
    const ally_pieces = board.getColorPieces(color);
    const enemy_pieces = board.getColorPieces(color.turn());
    const empty_squares = ~(ally_pieces | enemy_pieces);

    const mask = empty_squares & east_mask & west_mask;

    var to_ne_sw = from;
    var to_nw_se = from;

    for (0..7) |_| {
        to_ne_sw |= (BitBoard.move(to_ne_sw, .ne) | BitBoard.move(to_ne_sw, .sw)) & mask;
        to_nw_se |= (BitBoard.move(to_nw_se, .nw) | BitBoard.move(to_nw_se, .se)) & mask;
    }

    to_ne_sw |= (BitBoard.move(to_ne_sw, .ne) & east_mask) | (BitBoard.move(to_ne_sw, .sw) & west_mask);
    to_nw_se |= (BitBoard.move(to_nw_se, .nw) & west_mask) | (BitBoard.move(to_nw_se, .se) & east_mask);

    const masked_e = from & east_mask;
    const masked_w = from & west_mask;

    const to_n: u81 = BitBoard.move(from, .n);
    const to_s: u81 = BitBoard.move(from, .s);
    const to_e: u81 = BitBoard.move(masked_e, .e);
    const to_w: u81 = BitBoard.move(masked_w, .w);

    return (to_ne_sw | to_nw_se | to_n | to_s | to_e | to_w) & ~ally_pieces;
}

/// 先手の飛車の移動できる範囲
pub fn rook(board: Board, from: u81, color: Game.PlayerColor) u81 {
    const ally_pieces = board.getColorPieces(color);
    const enemy_pieces = board.getColorPieces(color.turn());
    const empty_squares = ~(ally_pieces | enemy_pieces);

    const mask = empty_squares & east_mask & west_mask;

    var to_n_s = from;
    var to_e_w = from;

    for (0..7) |_| {
        to_n_s |= (BitBoard.move(to_n_s, .s) | BitBoard.move(to_n_s, .n)) & empty_squares;
        to_e_w |= (BitBoard.move(to_e_w, .e) | BitBoard.move(to_e_w, .w)) & mask;
    }

    to_n_s |= BitBoard.move(to_n_s, .s) | BitBoard.move(to_n_s, .n);
    to_e_w |= (BitBoard.move(to_e_w, .e) & east_mask) | (BitBoard.move(to_e_w, .w) & west_mask);

    return (to_n_s | to_e_w) & ~ally_pieces;
}

/// 先手の龍王の移動できる範囲
pub fn promotedRook(board: Board, from: u81, color: Game.PlayerColor) u81 {
    const ally_pieces = board.getColorPieces(color);
    const enemy_pieces = board.getColorPieces(color.turn());
    const empty_squares = ~(ally_pieces | enemy_pieces);

    const mask = empty_squares & east_mask & west_mask;

    var to_n_s = from;
    var to_e_w = from;

    for (0..7) |_| {
        to_n_s |= (BitBoard.move(to_n_s, .s) | BitBoard.move(to_n_s, .n)) & empty_squares;
        to_e_w |= (BitBoard.move(to_e_w, .e) | BitBoard.move(to_e_w, .w)) & mask;
    }

    to_n_s |= BitBoard.move(to_n_s, .s) | BitBoard.move(to_n_s, .n);
    to_e_w |= (BitBoard.move(to_e_w, .e) & east_mask) | (BitBoard.move(to_e_w, .w) & west_mask);

    const masked_e = from & east_mask;
    const masked_w = from & west_mask;

    const to_ne: u81 = BitBoard.move(masked_e, .ne);
    const to_nw: u81 = BitBoard.move(masked_w, .nw);
    const to_se: u81 = BitBoard.move(masked_e, .se);
    const to_sw: u81 = BitBoard.move(masked_w, .sw);

    return (to_n_s | to_e_w | to_ne | to_nw | to_se | to_sw) & ~ally_pieces;
}

/// 先手の王将の移動できる範囲
pub fn king(board: Board, from: u81, color: Game.PlayerColor) u81 {
    const ally_pieces = board.getColorPieces(color);

    const masked_e = from & east_mask;
    const masked_w = from & west_mask;

    const to_n: u81 = BitBoard.move(from, .n);
    const to_s: u81 = BitBoard.move(from, .s);
    const to_e: u81 = BitBoard.move(masked_e, .e);
    const to_w: u81 = BitBoard.move(masked_w, .w);
    const to_ne: u81 = BitBoard.move(masked_e, .ne);
    const to_nw: u81 = BitBoard.move(masked_w, .nw);
    const to_se: u81 = BitBoard.move(masked_e, .se);
    const to_sw: u81 = BitBoard.move(masked_w, .sw);

    return (to_n | to_s | to_e | to_w | to_ne | to_nw | to_se | to_sw) & ~ally_pieces;
}
