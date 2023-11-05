const std = @import("std");

const bit_board = @import("bit-board");
const Board = @import("Board.zig");

pub fn getMovePawnBlack(b: Board, pawn_place: u64) u64 {
    const move_n2_dests = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\oooooooo
        \\........
        \\........
        \\........
    , 'o');

    const white_pieces = b.getColorPieces(.white);
    const black_pieces = b.getColorPieces(.black);
    const empties = ~(white_pieces | black_pieces);

    const move_n: u64 = (pawn_place >> 8) & empties;
    const move_n2: u64 = (move_n >> 8) & empties & move_n2_dests;
    const move_ne_nw: u64 = (pawn_place >> 7 | pawn_place >> 9) & white_pieces;

    return move_n | move_n2 | move_ne_nw;
}

pub fn getMovePawnWhite(b: Board, pawn_place: u64) u64 {
    const move_n2_dests = bit_board.fromString(
        \\........
        \\........
        \\........
        \\oooooooo
        \\........
        \\........
        \\........
        \\........
    , 'o');

    const white_pieces = b.getColorPieces(.white);
    const black_pieces = b.getColorPieces(.black);
    const empties = ~(white_pieces | black_pieces);

    const move_s: u64 = (pawn_place << 8) & empties;
    const move_s2: u64 = (move_s << 8) & empties & move_n2_dests;
    const move_se_sw: u64 = (pawn_place << 7 | pawn_place << 9) & black_pieces;

    return move_s | move_s2 | move_se_sw;
}

test "get black pawn's move 1: first move" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....P...
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'P');

    const pawnmove = getMovePawnBlack(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\....o...
        \\........
        \\........
    );
}

test "get black pawn's move 2: front ally" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....N...
        \\....P...
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'P');

    const pawnmove = getMovePawnBlack(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

test "get black pawn's move 3: front enemy" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....n...
        \\....P...
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'P');

    const pawnmove = getMovePawnBlack(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

test "get black pawn's move 4: diagonal piece" {
    const board_str =
        \\........
        \\........
        \\........
        \\...n.N..
        \\....P...
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'P');

    const pawnmove = getMovePawnBlack(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\...oo...
        \\........
        \\........
        \\........
        \\........
    );
}

test "get black pawn's move 5: multiple pawns" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....P...
        \\.....PP.
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'P');

    const pawnmove = getMovePawnBlack(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\........
        \\....ooo.
        \\.....oo.
        \\........
        \\........
    );
}

test "get white pawn's move 1: first move" {
    const board_str =
        \\........
        \\....p...
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'p');

    const pawnmove = getMovePawnWhite(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\....o...
        \\....o...
        \\........
        \\........
        \\........
        \\........
    );
}

test "get white pawn's move 2: front ally" {
    const board_str =
        \\........
        \\....p...
        \\....n...
        \\........
        \\........
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'p');

    const pawnmove = getMovePawnWhite(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

test "get white pawn's move 3: front enemy" {
    const board_str =
        \\........
        \\....p...
        \\....N...
        \\........
        \\........
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'p');

    const pawnmove = getMovePawnWhite(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

test "get white pawn's move 4: diagonal piece" {
    const board_str =
        \\........
        \\........
        \\........
        \\....p...
        \\...n.N..
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'p');

    const pawnmove = getMovePawnWhite(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\........
        \\....oo..
        \\........
        \\........
        \\........
    );
}

test "get white pawn's move 5: multiple pawns" {
    const board_str =
        \\........
        \\.pp.....
        \\...p....
        \\........
        \\........
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'p');

    const pawnmove = getMovePawnWhite(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\.oo.....
        \\.ooo....
        \\........
        \\........
        \\........
        \\........
    );
}
