const std = @import("std");

const bit_board = @import("../bit-board/main.zig");
const Board = @import("Board.zig");

const east_west_mask = bit_board.fromString(
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
    \\.oooooo.
, 'o');

const east_mask = bit_board.fromString(
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
    \\ooooooo.
, 'o');

const east_mask_double = bit_board.fromString(
    \\oooooo..
    \\oooooo..
    \\oooooo..
    \\oooooo..
    \\oooooo..
    \\oooooo..
    \\oooooo..
    \\oooooo..
, 'o');

const west_mask = bit_board.fromString(
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
    \\.ooooooo
, 'o');

const west_mask_double = bit_board.fromString(
    \\..oooooo
    \\..oooooo
    \\..oooooo
    \\..oooooo
    \\..oooooo
    \\..oooooo
    \\..oooooo
    \\..oooooo
, 'o');

const white_pawn_double_step_target = bit_board.fromString(
    \\........
    \\........
    \\........
    \\........
    \\oooooooo
    \\........
    \\........
    \\........
, 'o');

const black_pawn_double_step_target = bit_board.fromString(
    \\........
    \\........
    \\........
    \\oooooooo
    \\........
    \\........
    \\........
    \\........
, 'o');

pub fn pawn(b: Board, pawn_place: u64, color: Board.Color) u64 {
    return switch (color) {
        .black => pawnBlack(b, pawn_place),
        .white => pawnWhite(b, pawn_place),
    };
}

fn pawnBlack(b: Board, pawn_place: u64) u64 {
    const white_pieces = b.getColorPieces(.white);
    const black_pieces = b.getColorPieces(.black);
    const empties = ~(white_pieces | black_pieces);

    const move_s: u64 = (pawn_place << 8) & empties;
    const move_s2: u64 = (move_s << 8) & empties & black_pawn_double_step_target;
    const move_se: u64 = (pawn_place << 7) & east_mask;
    const move_sw: u64 = (pawn_place << 9) & west_mask;

    return move_s | move_s2 | ((move_se | move_sw) & white_pieces);
}

fn pawnWhite(b: Board, pawn_place: u64) u64 {
    const white_pieces = b.getColorPieces(.white);
    const black_pieces = b.getColorPieces(.black);
    const empties = ~(white_pieces | black_pieces);

    const move_n: u64 = (pawn_place >> 8) & empties;
    const move_n2: u64 = (move_n >> 8) & empties & white_pawn_double_step_target;
    const move_ne: u64 = (pawn_place >> 9) & east_mask;
    const move_nw: u64 = (pawn_place >> 7) & west_mask;

    return move_n | move_n2 | ((move_ne | move_nw) & black_pieces);
}

pub fn knight(b: Board, knight_place: u64, player_color: Board.Color) u64 {
    const ve_masked = knight_place & east_mask;
    const vw_masked = knight_place & west_mask;
    const he_masked = knight_place & east_mask_double;
    const hw_masked = knight_place & west_mask_double;

    const move_nne_sse: u64 = ve_masked >> 15 | ve_masked << 17;
    const move_nnw_ssw: u64 = vw_masked >> 17 | vw_masked << 15;
    const move_nee_see: u64 = he_masked >> 6 | he_masked << 10;
    const move_nww_sww: u64 = hw_masked >> 10 | hw_masked << 6;

    return ~b.getColorPieces(player_color) & (move_nne_sse | move_nnw_ssw | move_nee_see | move_nww_sww);
}

pub fn bishop(b: Board, bishop_place: u64, player_color: Board.Color) u64 {
    const ally_pieces = b.getColorPieces(player_color);
    const opponent_pieces = b.getColorPieces(player_color.turn());
    const empties = ~(ally_pieces | opponent_pieces);

    const mask = empties & east_west_mask;

    var move_ne_sw = bishop_place;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 & east_mask) | (move_ne_sw >> 7 & west_mask);

    var move_nw_se = bishop_place;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 & west_mask) | (move_nw_se >> 9 & east_mask);

    return ~ally_pieces & (move_ne_sw | move_nw_se);
}

pub fn rook(b: Board, rook_place: u64, player_color: Board.Color) u64 {
    const ally_pieces = b.getColorPieces(player_color);
    const opponent_pieces = b.getColorPieces(player_color.turn());
    const empties = ~(ally_pieces | opponent_pieces);

    const mask = empties & east_west_mask;

    var move_n_s = rook_place;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8);

    var move_e_w = rook_place;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 & west_mask) | (move_e_w >> 1 & east_mask);

    return ~ally_pieces & (move_n_s | move_e_w);
}

pub fn queen(b: Board, queen_place: u64, player_color: Board.Color) u64 {
    const ally_pieces = b.getColorPieces(player_color);
    const opponent_pieces = b.getColorPieces(player_color.turn());
    const empties = ~(ally_pieces | opponent_pieces);

    const mask = empties & east_west_mask;

    var move_n_s = queen_place;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8) & empties;
    move_n_s |= (move_n_s << 8 | move_n_s >> 8);

    var move_e_w = queen_place;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 | move_e_w >> 1) & mask;
    move_e_w |= (move_e_w << 1 & west_mask) | (move_e_w >> 1 & east_mask);

    var move_ne_sw = queen_place;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 & east_mask) | (move_ne_sw >> 7 & west_mask);

    var move_nw_se = queen_place;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 & west_mask) | (move_nw_se >> 9 & east_mask);

    return ~ally_pieces & (move_n_s | move_e_w | move_ne_sw | move_nw_se);
}

pub fn king(b: Board, king_place: u64, player_color: Board.Color) u64 {
    const e_masked = king_place & east_mask;
    const w_masked = king_place & west_mask;

    const move_n_s: u64 = king_place >> 8 | king_place << 8;
    const move_e_ne_se: u64 = e_masked << 1 | e_masked << 9 | e_masked >> 7;
    const move_w_nw_sw: u64 = w_masked >> 1 | w_masked << 7 | w_masked >> 9;

    return ~b.getColorPieces(player_color) & (move_n_s | move_e_ne_se | move_w_nw_sw);
}
