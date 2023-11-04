const std = @import("std");

const bit_board = @import("bit-board");
const Board = @import("Board.zig");

pub fn getMoveQueen(b: Board, queen_place: u64) u64 {
    const ally_pieces = b.getPlayer();
    const opponent_pieces = b.getOpponent();
    const empties = ~(ally_pieces | opponent_pieces);

    const mask = empties & bit_board.fromString(
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
    , 'o');

    const left_mask = bit_board.fromString(
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
        \\ooooooo.
    , 'o');
    const right_mask = bit_board.fromString(
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
        \\.ooooooo
    , 'o');

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
    move_e_w |= (move_e_w << 1 & right_mask) | (move_e_w >> 1 & left_mask);

    var move_ne_sw = queen_place;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 & left_mask) | (move_ne_sw >> 7 & right_mask);

    var move_nw_se = queen_place;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 & right_mask) | (move_nw_se >> 9 & left_mask);

    return ~ally_pieces & (move_n_s | move_e_w | move_ne_sw | move_nw_se);
}

test "get queen's move 1: center" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\....q...
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'q');

    const pawnmove = getMoveQueen(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\o...o...
        \\.o..o..o
        \\..o.o.o.
        \\...ooo..
        \\oooo.ooo
        \\...ooo..
        \\..o.o.o.
        \\.o..o..o
    );
}

test "get queen's move 2: edge" {
    const board_str =
        \\........
        \\........
        \\........
        \\q.......
        \\........
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'q');

    const pawnmove = getMoveQueen(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\o..o....
        \\o.o.....
        \\oo......
        \\.ooooooo
        \\oo......
        \\o.o.....
        \\o..o....
        \\o...o...
    );
}

test "get queen's move 3: with other pieces" {
    const board_str =
        \\........
        \\........
        \\..N.b.B.
        \\........
        \\..n.q.r.
        \\........
        \\..P.p.R.
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'q');

    const pawnmove = getMoveQueen(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\..o...o.
        \\...ooo..
        \\...o.o..
        \\...ooo..
        \\..o...o.
        \\........
    );
}

test "get queen's move 4: multiple queens" {
    const board_str =
        \\........
        \\........
        \\.....q..
        \\........
        \\........
        \\........
        \\...q....
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'q');

    const pawnmove = getMoveQueen(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\...o.o.o
        \\...oooo.
        \\ooooo.oo
        \\o..oooo.
        \\.o.o.o.o
        \\..oooo..
        \\ooo.oooo
        \\o.oooo..
    );
}

test "get queen's move 5: next to piece" {
    const board_str =
        \\........
        \\........
        \\........
        \\...brR..
        \\...Bqp..
        \\...nNP..
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'q');

    const pawnmove = getMoveQueen(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\.....o..
        \\...o....
        \\....oo..
        \\........
        \\........
    );
}
