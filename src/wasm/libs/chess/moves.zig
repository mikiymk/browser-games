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

pub fn pawn(b: Board, pawn_place: BitBoard, color: Board.Color) BitBoard {
    return switch (color) {
        .black => pawnBlack(b, pawn_place),
        .white => pawnWhite(b, pawn_place),
    };
}

fn pawnBlack(b: Board, pawn_place: BitBoard) BitBoard {
    const white_pieces = b.getColorPieces(.white);
    const black_pieces = b.getColorPieces(.black);

    const empties = white_pieces.unions(black_pieces).inversed();

    const move_s = BitBoard.move(pawn_place, .s).masks(empties);
    const move_s2 = BitBoard.move(move_s, .s).masks(empties).masks(black_pawn_double_step_target);
    const move_se = BitBoard.move(pawn_place, .se).masks(east_mask);
    const move_sw = BitBoard.move(pawn_place, .sw).masks(west_mask);

    return move_s.unions(move_s2).unions(move_se.unions(move_sw).masks(white_pieces));
}

fn pawnWhite(b: Board, pawn_place: BitBoard) BitBoard {
    const white_pieces = b.getColorPieces(.white);
    const black_pieces = b.getColorPieces(.black);

    const empties = white_pieces.unions(black_pieces).inversed();

    const move_n = BitBoard.move(pawn_place, .n).masks(empties);
    const move_n2 = BitBoard.move(move_n, .n).masks(empties).masks(white_pawn_double_step_target);
    const move_ne = BitBoard.move(pawn_place, .ne).masks(east_mask);
    const move_nw = BitBoard.move(pawn_place, .nw).masks(west_mask);

    return move_n.unions(move_n2).unions(move_ne.unions(move_nw).masks(black_pieces));
}

pub fn knight(b: Board, knight_place: BitBoard, player_color: Board.Color) BitBoard {
    const ve_masked = knight_place.masks(east_mask);
    const vw_masked = knight_place.masks(west_mask);
    const he_masked = knight_place.masks(east_mask_double);
    const hw_masked = knight_place.masks(west_mask_double);

    const move_e = BitBoard.move(he_masked, .e);
    const move_w = BitBoard.move(hw_masked, .w);

    var move = BitBoard.move(BitBoard.move(ve_masked, .n), .ne);
    move.setUnion(BitBoard.move(BitBoard.move(ve_masked, .s), .se));

    move.setUnion(BitBoard.move(BitBoard.move(vw_masked, .n), .nw));
    move.setUnion(BitBoard.move(BitBoard.move(vw_masked, .s), .sw));

    move.setUnion(BitBoard.move(move_e, .ne));
    move.setUnion(BitBoard.move(move_e, .se));

    move.setUnion(BitBoard.move(move_w, .nw));
    move.setUnion(BitBoard.move(move_w, .sw));

    return move.masks(b.getColorPieces(player_color).inversed());
}

pub fn bishop(b: Board, bishop_place: BitBoard, player_color: Board.Color) BitBoard {
    const ally_pieces = b.getColorPieces(player_color);
    const opponent_pieces = b.getColorPieces(player_color.turn());

    const empties = ally_pieces.unions(opponent_pieces).inversed();

    const mask = empties.masks(east_west_mask);

    var move_ne_sw = bishop_place;
    for (0..6) |_| {
        move_ne_sw.setUnion(BitBoard.move(move_ne_sw, .ne)
            .unions(BitBoard.move(move_ne_sw, .sw))
            .masks(mask));
    }
    move_ne_sw.setUnion(BitBoard.move(move_ne_sw, .ne).masks(east_mask));
    move_ne_sw.setUnion(BitBoard.move(move_ne_sw, .sw).masks(west_mask));

    var move_nw_se = bishop_place;
    for (0..6) |_| {
        move_nw_se.setUnion(BitBoard.move(move_nw_se, .nw)
            .unions(BitBoard.move(move_nw_se, .se))
            .masks(mask));
    }
    move_nw_se.setUnion(BitBoard.move(move_nw_se, .nw).masks(west_mask));
    move_nw_se.setUnion(BitBoard.move(move_nw_se, .se).masks(east_mask));

    return move_ne_sw.unions(move_nw_se).masks(ally_pieces.inversed());
}

pub fn rook(b: Board, rook_place: BitBoard, player_color: Board.Color) BitBoard {
    const ally_pieces = b.getColorPieces(player_color);
    const opponent_pieces = b.getColorPieces(player_color.turn());

    const empties = ally_pieces.unions(opponent_pieces).inversed();

    const mask = empties.masks(east_west_mask);

    var move_n_s = rook_place;
    for (0..6) |_| {
        move_n_s.setUnion(BitBoard.move(move_n_s, .n)
            .unions(BitBoard.move(move_n_s, .s))
            .masks(empties));
    }
    move_n_s.setUnion(BitBoard.move(move_n_s, .n));
    move_n_s.setUnion(BitBoard.move(move_n_s, .s));

    var move_e_w = rook_place;
    for (0..6) |_| {
        move_e_w.setUnion(BitBoard.move(move_e_w, .e)
            .unions(BitBoard.move(move_e_w, .w))
            .masks(mask));
    }
    move_e_w.setUnion(BitBoard.move(move_e_w, .e).masks(east_mask));
    move_e_w.setUnion(BitBoard.move(move_e_w, .w).masks(west_mask));

    return move_n_s.unions(move_e_w).masks(ally_pieces.inversed());
}

pub fn queen(b: Board, queen_place: BitBoard, player_color: Board.Color) BitBoard {
    const ally_pieces = b.getColorPieces(player_color);
    const opponent_pieces = b.getColorPieces(player_color.turn());

    const empties = ally_pieces.unions(opponent_pieces).inversed();

    const mask = empties.masks(east_west_mask);

    var move_n_s = queen_place;
    for (0..6) |_| {
        move_n_s.setUnion(BitBoard.move(move_n_s, .n)
            .unions(BitBoard.move(move_n_s, .s))
            .masks(empties));
    }
    move_n_s.setUnion(BitBoard.move(move_n_s, .n));
    move_n_s.setUnion(BitBoard.move(move_n_s, .s));

    var move_e_w = queen_place;
    for (0..6) |_| {
        move_e_w.setUnion(BitBoard.move(move_e_w, .e)
            .unions(BitBoard.move(move_e_w, .w))
            .masks(mask));
    }
    move_e_w.setUnion(BitBoard.move(move_e_w, .e).masks(east_mask));
    move_e_w.setUnion(BitBoard.move(move_e_w, .w).masks(west_mask));

    var move_ne_sw = queen_place;
    for (0..6) |_| {
        move_ne_sw.setUnion(BitBoard.move(move_ne_sw, .ne)
            .unions(BitBoard.move(move_ne_sw, .sw))
            .masks(mask));
    }
    move_ne_sw.setUnion(BitBoard.move(move_ne_sw, .ne).masks(east_mask));
    move_ne_sw.setUnion(BitBoard.move(move_ne_sw, .sw).masks(west_mask));

    var move_nw_se = queen_place;
    for (0..6) |_| {
        move_nw_se.setUnion(BitBoard.move(move_nw_se, .nw)
            .unions(BitBoard.move(move_nw_se, .se))
            .masks(mask));
    }
    move_nw_se.setUnion(BitBoard.move(move_nw_se, .nw).masks(west_mask));
    move_nw_se.setUnion(BitBoard.move(move_nw_se, .se).masks(east_mask));

    return move_n_s
        .unions(move_e_w)
        .unions(move_ne_sw)
        .unions(move_nw_se)
        .masks(ally_pieces.inversed());
}

pub fn king(b: Board, king_place: BitBoard, player_color: Board.Color) BitBoard {
    const e_masked = king_place.masks(east_mask);
    const w_masked = king_place.masks(west_mask);

    const ally_pieces = b.getColorPieces(player_color).inversed();

    var move = BitBoard.move(king_place, .n);
    move.setUnion(BitBoard.move(king_place, .s));
    move.setUnion(BitBoard.move(e_masked, .e));
    move.setUnion(BitBoard.move(e_masked, .ne));
    move.setUnion(BitBoard.move(e_masked, .se));
    move.setUnion(BitBoard.move(w_masked, .w));
    move.setUnion(BitBoard.move(w_masked, .nw));
    move.setUnion(BitBoard.move(w_masked, .sw));

    return move.masks(ally_pieces);
}
