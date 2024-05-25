// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");

// internal import
const main = @import("./main.zig");
const Game = main.Game;
const Board = main.Board;
const moves = main.moves;

const BitBoard = Board.BitBoard;
const PromotionPiece = Board.PromotionPiece;
const Color = Board.Color;

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

pub fn move(board: Board, from: BitBoard) BitBoard {
    const square = board.getPieceAt(from);
    const color_piece = square.toColorPiece() orelse return BitBoard.init();

    return moveByPiece(board, from, color_piece.piece, color_piece.color);
}

pub fn moveByPiece(board: Board, from: BitBoard, piece: PromotionPiece, color: Color) BitBoard {
    return switch (piece) {
        .pawn => pawn(board, from, color),
        .lance => lance(board, from, color),
        .knight => knight(board, from, color),
        .silver => silver(board, from, color),
        .gold,
        .pawn_promoted,
        .lance_promoted,
        .knight_promoted,
        .silver_promoted,
        => gold(board, from, color),
        .bishop => bishop(board, from, color),
        .rook => rook(board, from, color),
        .bishop_promoted => promotedBishop(board, from, color),
        .rook_promoted => promotedRook(board, from, color),
        .king => king(board, from, color),
    };
}

/// 歩兵の移動できる範囲
pub fn pawn(board: Board, from: BitBoard, color: Color) BitBoard {
    return switch (color) {
        .black => blackPawn(board, from),
        .white => whitePawn(board, from),
    };
}

/// 先手の歩兵の移動できる範囲
pub fn whitePawn(board: Board, from: BitBoard) BitBoard {
    const to = from.move(.n);
    const ally_pieces = board.getColorPieces(.white);

    return to.masks(ally_pieces.inversed());
}

/// 後手の歩兵の移動できる範囲
pub fn blackPawn(board: Board, from: BitBoard) BitBoard {
    const to = from.move(.s);
    const ally_pieces = board.getColorPieces(.black);

    return to.excludes(ally_pieces);
}

/// 香車の移動できる範囲
pub fn lance(board: Board, from: BitBoard, color: Color) BitBoard {
    return switch (color) {
        .black => blackLance(board, from),
        .white => whiteLance(board, from),
    };
}

/// 先手の香車の移動できる範囲
pub fn whiteLance(board: Board, from: BitBoard) BitBoard {
    const ally_pieces = board.getColorPieces(.white);
    const enemy_pieces = board.getColorPieces(.black);
    const empty_squares = ally_pieces.unions(enemy_pieces).inversed();

    var to = from;

    for (0..7) |_| {
        to.setUnion(to.move(.n).masks(empty_squares));
    }

    return to.move(.n).excludes(ally_pieces);
}

/// 後手の香車の移動できる範囲
pub fn blackLance(board: Board, from: BitBoard) BitBoard {
    const ally_pieces = board.getColorPieces(.black);
    const enemy_pieces = board.getColorPieces(.white);
    const empty_squares = ally_pieces.unions(enemy_pieces).inversed();

    var to = from;

    for (0..7) |_| {
        to.setUnion(to.move(.s).masks(empty_squares));
    }

    return to.move(.s).excludes(ally_pieces);
}

/// 桂馬の移動できる範囲
pub fn knight(board: Board, from: BitBoard, color: Color) BitBoard {
    return switch (color) {
        .black => blackKnight(board, from),
        .white => whiteKnight(board, from),
    };
}

/// 先手の桂馬の移動できる範囲
pub fn whiteKnight(board: Board, from: BitBoard) BitBoard {
    const to_nne = from.masks(east_mask).move(.ne).move(.n);
    const to_nnw = from.masks(west_mask).move(.nw).move(.n);
    const ally_pieces = board.getColorPieces(.white);

    return (to_nne).unions(to_nnw).excludes(ally_pieces);
}

/// 後手の桂馬の移動できる範囲
pub fn blackKnight(board: Board, from: BitBoard) BitBoard {
    const to_sse = from.masks(east_mask).move(.se).move(.s);
    const to_ssw = from.masks(west_mask).move(.sw).move(.s);
    const ally_pieces = board.getColorPieces(.black);

    return to_sse.unions(to_ssw).excludes(ally_pieces);
}

/// 銀将の移動できる範囲
pub fn silver(board: Board, from: BitBoard, color: Color) BitBoard {
    return switch (color) {
        .black => blackSilver(board, from),
        .white => whiteSilver(board, from),
    };
}

/// 先手の銀将の移動できる範囲
pub fn whiteSilver(board: Board, from: BitBoard) BitBoard {
    const masked_e = from.masks(east_mask);
    const masked_w = from.masks(west_mask);

    const to_n = from.move(.n);
    const to_ne = masked_e.move(.ne);
    const to_nw = masked_w.move(.nw);
    const to_se = masked_e.move(.se);
    const to_sw = masked_w.move(.sw);
    const ally_pieces = board.getColorPieces(.white);

    return (to_n).unions(to_ne).unions(to_nw).unions(to_se).unions(to_sw).excludes(ally_pieces);
}

/// 後手の銀将の移動できる範囲
pub fn blackSilver(board: Board, from: BitBoard) BitBoard {
    const masked_e = from.masks(east_mask);
    const masked_w = from.masks(west_mask);

    const to_s = from.move(.s);
    const to_ne = masked_e.move(.ne);
    const to_nw = masked_w.move(.nw);
    const to_se = masked_e.move(.se);
    const to_sw = masked_w.move(.sw);
    const ally_pieces = board.getColorPieces(.black);

    return to_s.unions(to_ne).unions(to_nw).unions(to_se).unions(to_sw).excludes(ally_pieces);
}

/// 金将の移動できる範囲
pub fn gold(board: Board, from: BitBoard, color: Color) BitBoard {
    return switch (color) {
        .black => blackGold(board, from),
        .white => whiteGold(board, from),
    };
}

/// 先手の金将の移動できる範囲
pub fn whiteGold(board: Board, from: BitBoard) BitBoard {
    const masked_e = from.masks(east_mask);
    const masked_w = from.masks(west_mask);

    const to_n = from.move(.n);
    const to_ne = masked_e.move(.ne);
    const to_nw = masked_w.move(.nw);
    const to_e = masked_e.move(.e);
    const to_w = masked_w.move(.w);
    const to_s = from.move(.s);
    const ally_pieces = board.getColorPieces(.white);

    return (to_n).unions(to_ne).unions(to_nw).unions(to_e).unions(to_w).unions(to_s).excludes(ally_pieces);
}

/// 後手の金将の移動できる範囲
pub fn blackGold(board: Board, from: BitBoard) BitBoard {
    const masked_e = from.masks(east_mask);
    const masked_w = from.masks(west_mask);

    const to_s = from.move(.s);
    const to_se = masked_e.move(.se);
    const to_sw = masked_w.move(.sw);
    const to_e = masked_e.move(.e);
    const to_w = masked_w.move(.w);
    const to_n = from.move(.n);
    const ally_pieces = board.getColorPieces(.black);

    return to_s
        .unions(to_se)
        .unions(to_sw)
        .unions(to_e)
        .unions(to_w)
        .unions(to_n)
        .excludes(ally_pieces);
}

/// 角行の移動できる範囲
pub fn bishop(board: Board, from: BitBoard, color: Color) BitBoard {
    const ally_pieces = board.getColorPieces(color);
    const enemy_pieces = board.getColorPieces(color.turn());
    const empty_squares = ally_pieces.unions(enemy_pieces).inversed();

    const mask = empty_squares.masks(east_mask).masks(west_mask);

    var to_ne_sw = from;
    var to_nw_se = from;

    for (0..7) |_| {
        to_ne_sw.setUnion(to_ne_sw.move(.nesw).masks(mask));
        to_nw_se.setUnion(to_nw_se.move(.nwse).masks(mask));
    }

    to_ne_sw.setUnion(to_ne_sw.move(.ne).masks(west_mask).unions(to_ne_sw.move(.sw).masks(east_mask)));
    to_nw_se.setUnion(to_nw_se.move(.nw).masks(east_mask).unions(to_nw_se.move(.se).masks(west_mask)));

    return to_ne_sw.unions(to_nw_se).excludes(ally_pieces);
}

/// 龍馬の移動できる範囲
pub fn promotedBishop(board: Board, from: BitBoard, color: Color) BitBoard {
    const ally_pieces = board.getColorPieces(color);
    const enemy_pieces = board.getColorPieces(color.turn());
    const empty_squares = ally_pieces.unions(enemy_pieces).inversed();

    const mask = empty_squares.masks(east_mask).masks(west_mask);

    var to_ne_sw = from;
    var to_nw_se = from;

    for (0..7) |_| {
        to_ne_sw.setUnion(to_ne_sw.move(.nesw).masks(mask));
        to_nw_se.setUnion(to_nw_se.move(.nwse).masks(mask));
    }

    to_ne_sw.setUnion(to_ne_sw.move(.ne).masks(west_mask).unions(to_ne_sw.move(.sw).masks(east_mask)));
    to_nw_se.setUnion(to_nw_se.move(.nw).masks(east_mask).unions(to_nw_se.move(.se).masks(west_mask)));

    const masked_e = from.masks(east_mask);
    const masked_w = from.masks(west_mask);

    const to_n = from.move(.n);
    const to_s = from.move(.s);
    const to_e = masked_e.move(.e);
    const to_w = masked_w.move(.w);

    return to_ne_sw.unions(to_nw_se).unions(to_n).unions(to_s).unions(to_e).unions(to_w).excludes(ally_pieces);
}

/// 飛車の移動できる範囲
pub fn rook(board: Board, from: BitBoard, color: Color) BitBoard {
    const ally_pieces = board.getColorPieces(color);
    const enemy_pieces = board.getColorPieces(color.turn());
    const empty_squares = ally_pieces.unions(enemy_pieces).inversed();

    const mask = empty_squares.masks(east_mask).masks(west_mask);

    var to_n_s = from;
    var to_e_w = from;

    for (0..7) |_| {
        to_n_s.setUnion(to_n_s.move(.s).unions(to_n_s.move(.n)).masks(empty_squares));
        to_e_w.setUnion(to_e_w.move(.e).unions(to_e_w.move(.w)).masks(mask));
    }

    to_n_s.setUnion(to_n_s.move(.s).unions(to_n_s.move(.n)));
    to_e_w.setUnion(to_e_w.move(.e).masks(west_mask).unions(to_e_w.move(.w).masks(east_mask)));

    return (to_n_s).unions(to_e_w).excludes(ally_pieces);
}

/// 龍王の移動できる範囲
pub fn promotedRook(board: Board, from: BitBoard, color: Color) BitBoard {
    const ally_pieces = board.getColorPieces(color);
    const enemy_pieces = board.getColorPieces(color.turn());
    const empty_squares = ally_pieces.unions(enemy_pieces).inversed();

    const mask = empty_squares.masks(east_mask).masks(west_mask);

    var to_n_s = from;
    var to_e_w = from;

    for (0..7) |_| {
        to_n_s.setUnion(to_n_s.move(.s).unions(to_n_s.move(.n)).masks(empty_squares));
        to_e_w.setUnion(to_e_w.move(.e).unions(to_e_w.move(.w)).masks(mask));
    }

    to_n_s.setUnion(to_n_s.move(.s).unions(to_n_s.move(.n)));
    to_e_w.setUnion(to_e_w.move(.e).masks(west_mask).unions(to_e_w.move(.w).masks(east_mask)));

    const masked_e = from.masks(east_mask);
    const masked_w = from.masks(west_mask);

    const to_ne = masked_e.move(.ne);
    const to_nw = masked_w.move(.nw);
    const to_se = masked_e.move(.se);
    const to_sw = masked_w.move(.sw);

    return (to_n_s).unions(to_e_w).unions(to_ne).unions(to_nw).unions(to_se).unions(to_sw).excludes(ally_pieces);
}

/// 王将の移動できる範囲
pub fn king(board: Board, from: BitBoard, color: Color) BitBoard {
    const ally_pieces = board.getColorPieces(color);

    const masked_e = from.masks(east_mask);
    const masked_w = from.masks(west_mask);

    const to_n = from.move(.n);
    const to_s = from.move(.s);
    const to_e = masked_e.move(.e);
    const to_w = masked_w.move(.w);
    const to_ne = masked_e.move(.ne);
    const to_nw = masked_w.move(.nw);
    const to_se = masked_e.move(.se);
    const to_sw = masked_w.move(.sw);

    return (to_n).unions(to_s).unions(to_e).unions(to_w).unions(to_ne).unions(to_nw).unions(to_se).unions(to_sw).excludes(ally_pieces);
}
