// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import
const main = @import("./main.zig");
const Board = main.Board;
const moves = main.moves;

// test import
test {
    _ = @import("./moves.test.zig");
}

const east_west_mask = BitBoard.fromString(
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
, 'o');

const east_mask = BitBoard.fromString(
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
, 'o');

const east_mask_double = BitBoard.fromString(
    \\oooooo..
    \\oooooo..
    \\oooooo..
    \\oooooo..
    \\oooooo..
    \\oooooo..
    \\oooooo..
    \\oooooo..
, 'o');

const west_mask = BitBoard.fromString(
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
, 'o');

const west_mask_double = BitBoard.fromString(
    \\..oooooo
    \\..oooooo
    \\..oooooo
    \\..oooooo
    \\..oooooo
    \\..oooooo
    \\..oooooo
    \\..oooooo
, 'o');

const white_pawn_double_step_target = BitBoard.fromString(
    \\........
    \\........
    \\........
    \\........
    \\oooooooo
    \\........
    \\........
    \\........
, 'o');

const black_pawn_double_step_target = BitBoard.fromString(
    \\........
    \\........
    \\........
    \\oooooooo
    \\........
    \\........
    \\........
    \\........
, 'o');

pub fn pawn(board: Board, pawn_place: BitBoard, color: Board.Color) BitBoard {
    return switch (color) {
        .black => pawnBlack(board, pawn_place),
        .white => pawnWhite(board, pawn_place),
    };
}

fn pawnBlack(board: Board, pawn_place: BitBoard) BitBoard {
    const white_pieces = board.getColorPieces(.white);
    const black_pieces = board.getColorPieces(.black);

    const empties = white_pieces.unions(black_pieces).getInverted();

    const move_s = pawn_place.move(.s).masks(empties);
    const move_s2 = move_s.move(.s).masks(empties).masks(black_pawn_double_step_target);
    const move_se = pawn_place.move(.se).masks(east_mask);
    const move_sw = pawn_place.move(.sw).masks(west_mask);

    return move_s.unions(move_s2).unions(move_se.unions(move_sw).masks(white_pieces));
}

fn pawnWhite(board: Board, pawn_place: BitBoard) BitBoard {
    const white_pieces = board.getColorPieces(.white);
    const black_pieces = board.getColorPieces(.black);

    const empties = white_pieces.unions(black_pieces).getInverted();

    const move_n = pawn_place.move(.n).masks(empties);
    const move_n2 = move_n.move(.n).masks(empties).masks(white_pawn_double_step_target);
    const move_ne = pawn_place.move(.ne).masks(east_mask);
    const move_nw = pawn_place.move(.nw).masks(west_mask);

    return move_n.unions(move_n2).unions(move_ne.unions(move_nw).masks(black_pieces));
}

pub fn knight(board: Board, knight_place: BitBoard, player_color: Board.Color) BitBoard {
    const ve_masked = knight_place.masks(east_mask);
    const vw_masked = knight_place.masks(west_mask);
    const he_masked = knight_place.masks(east_mask_double);
    const hw_masked = knight_place.masks(west_mask_double);

    const move_e = he_masked.move(.e);
    const move_w = hw_masked.move(.w);

    var move = ve_masked.move(.n).move(.ne);
    move.setUnion(ve_masked.move(.s).move(.se));

    move.setUnion(vw_masked.move(.n).move(.nw));
    move.setUnion(vw_masked.move(.s).move(.sw));

    move.setUnion(move_e.move(.ne));
    move.setUnion(move_e.move(.se));

    move.setUnion(move_w.move(.nw));
    move.setUnion(move_w.move(.sw));

    return move.masks(board.getColorPieces(player_color).getInverted());
}

pub fn bishop(board: Board, bishop_place: BitBoard, player_color: Board.Color) BitBoard {
    const ally_pieces = board.getColorPieces(player_color);
    const opponent_pieces = board.getColorPieces(player_color.turn());

    const empties = ally_pieces.unions(opponent_pieces).getInverted();

    const mask = empties.masks(east_west_mask);

    var move_ne_sw = bishop_place;
    var move_nw_se = bishop_place;

    for (0..6) |_| {
        move_ne_sw.setUnion(move_ne_sw.move(.ne).unions(move_ne_sw.move(.sw)).masks(mask));
        move_nw_se.setUnion(move_nw_se.move(.nw).unions(move_nw_se.move(.se)).masks(mask));
    }

    move_ne_sw.setUnion(move_ne_sw.move(.ne).masks(west_mask));
    move_ne_sw.setUnion(move_ne_sw.move(.sw).masks(east_mask));
    move_nw_se.setUnion(move_nw_se.move(.se).masks(west_mask));
    move_nw_se.setUnion(move_nw_se.move(.nw).masks(east_mask));

    return move_ne_sw.unions(move_nw_se).masks(ally_pieces.getInverted());
}

pub fn rook(board: Board, rook_place: BitBoard, player_color: Board.Color) BitBoard {
    const ally_pieces = board.getColorPieces(player_color);
    const opponent_pieces = board.getColorPieces(player_color.turn());

    const empties = ally_pieces.unions(opponent_pieces).getInverted();

    const mask = empties.masks(east_west_mask);

    var move_n_s = rook_place;
    var move_e_w = rook_place;

    for (0..6) |_| {
        move_n_s.setUnion(move_n_s.move(.n).unions(move_n_s.move(.s)).masks(empties));
        move_e_w.setUnion(move_e_w.move(.e).unions(move_e_w.move(.w)).masks(mask));
    }

    move_n_s.setUnion(move_n_s.move(.n));
    move_n_s.setUnion(move_n_s.move(.s));
    move_e_w.setUnion(move_e_w.move(.e).masks(west_mask));
    move_e_w.setUnion(move_e_w.move(.w).masks(east_mask));

    return move_n_s.unions(move_e_w).masks(ally_pieces.getInverted());
}

pub fn queen(board: Board, queen_place: BitBoard, player_color: Board.Color) BitBoard {
    const ally_pieces = board.getColorPieces(player_color);
    const opponent_pieces = board.getColorPieces(player_color.turn());

    const empties = ally_pieces.unions(opponent_pieces).getInverted();

    const mask = empties.masks(east_west_mask);

    var move_n_s = queen_place;
    var move_e_w = queen_place;
    var move_ne_sw = queen_place;
    var move_nw_se = queen_place;

    for (0..6) |_| {
        move_n_s.setUnion(move_n_s.move(.n).unions(move_n_s.move(.s)).masks(empties));
        move_e_w.setUnion(move_e_w.move(.e).unions(move_e_w.move(.w)).masks(mask));
        move_ne_sw.setUnion(move_ne_sw.move(.ne).unions(move_ne_sw.move(.sw)).masks(mask));
        move_nw_se.setUnion(move_nw_se.move(.nw).unions(move_nw_se.move(.se)).masks(mask));
    }

    move_n_s.setUnion(move_n_s.move(.n));
    move_n_s.setUnion(move_n_s.move(.s));
    move_e_w.setUnion(move_e_w.move(.e).masks(west_mask));
    move_e_w.setUnion(move_e_w.move(.w).masks(east_mask));
    move_ne_sw.setUnion(move_ne_sw.move(.ne).masks(west_mask));
    move_ne_sw.setUnion(move_ne_sw.move(.sw).masks(east_mask));
    move_nw_se.setUnion(move_nw_se.move(.se).masks(west_mask));
    move_nw_se.setUnion(move_nw_se.move(.nw).masks(east_mask));

    return move_n_s
        .unions(move_e_w)
        .unions(move_ne_sw)
        .unions(move_nw_se)
        .excludes(ally_pieces);
}

pub fn king(board: Board, king_place: BitBoard, player_color: Board.Color) BitBoard {
    const e_masked = king_place.masks(east_mask);
    const w_masked = king_place.masks(west_mask);

    const ally_pieces = board.getColorPieces(player_color).getInverted();

    var move = king_place.move(.n);
    move.setUnion(king_place.move(.s));
    move.setUnion(e_masked.move(.e));
    move.setUnion(e_masked.move(.ne));
    move.setUnion(e_masked.move(.se));
    move.setUnion(w_masked.move(.w));
    move.setUnion(w_masked.move(.nw));
    move.setUnion(w_masked.move(.sw));

    return move.masks(ally_pieces);
}
