const std = @import("std");

const bit_board = @import("bit-board");
const Board = @import("Board.zig");

pub fn getMoveBishop(b: Board, bishop_place: u64) u64 {
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

    var move_ne_sw = bishop_place;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 | move_ne_sw >> 7) & mask;
    move_ne_sw |= (move_ne_sw << 7 & left_mask) | (move_ne_sw >> 7 & right_mask);

    var move_nw_se = bishop_place;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 | move_nw_se >> 9) & mask;
    move_nw_se |= (move_nw_se << 9 & right_mask) | (move_nw_se >> 9 & left_mask);

    return ~ally_pieces & (move_ne_sw | move_nw_se);
}

test "get bishop's move 1: center" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\....b...
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'b');

    const pawnmove = getMoveBishop(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\o.......
        \\.o.....o
        \\..o...o.
        \\...o.o..
        \\........
        \\...o.o..
        \\..o...o.
        \\.o.....o
    );
}

test "get bishop's move 2: corner" {
    const board_str =
        \\b.......
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'b');

    const pawnmove = getMoveBishop(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\.o......
        \\..o.....
        \\...o....
        \\....o...
        \\.....o..
        \\......o.
        \\.......o
    );
}

test "get bishop's move 3: with other pieces" {
    const board_str =
        \\........
        \\........
        \\..n...N.
        \\........
        \\....b...
        \\........
        \\..R...r.
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'b');

    const pawnmove = getMoveBishop(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\......o.
        \\...o.o..
        \\........
        \\...o.o..
        \\..o.....
        \\........
    );
}

test "get bishop's move 4: multiple bishops" {
    const board_str =
        \\........
        \\........
        \\........
        \\....b...
        \\....b...
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'b');

    const pawnmove = getMoveBishop(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\oo.....o
        \\.oo...oo
        \\..oo.oo.
        \\...o.o..
        \\...o.o..
        \\..oo.oo.
        \\.oo...oo
        \\oo.....o
    );
}

test "get bishop's move 5: next to piece" {
    const board_str =
        \\........
        \\........
        \\........
        \\...p.P..
        \\....b...
        \\...n.N..
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'b');

    const pawnmove = getMoveBishop(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\.....o..
        \\........
        \\.....o..
        \\........
        \\........
    );
}
