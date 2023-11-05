const std = @import("std");

const bit_board = @import("bit-board");
const Board = @import("Board.zig");

pub fn getMoveKnight(b: Board, knight_place: u64, player_color: Board.Color) u64 {
    const vertical_east_moves_mask = bit_board.fromString(
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
    , 'o');

    const vertical_west_moves_mask = bit_board.fromString(
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
    , 'o');

    const horizontal_east_moves_mask = bit_board.fromString(
        \\oooooo..
        \\oooooo..
        \\oooooo..
        \\oooooo..
        \\oooooo..
        \\oooooo..
        \\oooooo..
        \\oooooo..
    , 'o');

    const horizontal_west_moves_mask = bit_board.fromString(
        \\..oooooo
        \\..oooooo
        \\..oooooo
        \\..oooooo
        \\..oooooo
        \\..oooooo
        \\..oooooo
        \\..oooooo
    , 'o');

    const ve_masked = knight_place & vertical_east_moves_mask;
    const vw_masked = knight_place & vertical_west_moves_mask;
    const he_masked = knight_place & horizontal_east_moves_mask;
    const hw_masked = knight_place & horizontal_west_moves_mask;

    const move_nne_sse: u64 = ve_masked >> 15 | ve_masked << 17;
    const move_nnw_ssw: u64 = vw_masked >> 17 | vw_masked << 15;
    const move_nee_see: u64 = he_masked >> 6 | he_masked << 10;
    const move_nww_sww: u64 = hw_masked >> 10 | hw_masked << 6;

    return ~b.getColorPieces(player_color) & (move_nne_sse | move_nnw_ssw | move_nee_see | move_nww_sww);
}

test "get knight's move 1: center" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\.....n..
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'n');

    const pawnmove = getMoveKnight(board, pos, .white);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\....o.o.
        \\...o...o
        \\........
        \\...o...o
        \\....o.o.
    );
}

test "get knight's move 2: close to edge" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\......n.
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'n');

    const pawnmove = getMoveKnight(board, pos, .white);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\.....o.o
        \\....o...
        \\........
        \\....o...
        \\.....o.o
    );
}

test "get knight's move 3: edge" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\.......n
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'n');

    const pawnmove = getMoveKnight(board, pos, .white);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\......o.
        \\.....o..
        \\........
        \\.....o..
        \\......o.
    );
}

test "get knight's move 4: with other pieces" {
    const board_str =
        \\........
        \\........
        \\...Q.q..
        \\..b...P.
        \\....n...
        \\..B...p.
        \\...r.R..
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'n');

    const pawnmove = getMoveKnight(board, pos, .white);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\...o....
        \\......o.
        \\........
        \\..o.....
        \\.....o..
        \\........
    );
}

test "get knight's move 5: multiple knights" {
    const board_str =
        \\........
        \\........
        \\........
        \\...n....
        \\....n...
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'n');

    const pawnmove = getMoveKnight(board, pos, .white);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\..o.o...
        \\.o.o.o..
        \\..o...o.
        \\.o...o..
        \\..o.o.o.
        \\...o.o..
        \\........
    );
}
