const std = @import("std");

const bit_board = @import("bit-board");
const Board = @import("Board.zig");

pub fn getMoveKnight(b: Board, knight_place: u64) u64 {
    const static = struct {
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

        var knight_moves: [64]u64 = .{0} ** 64;

        pub fn initKnightMoves() void {
            for (0..64) |i| {
                const place = @as(u64, 1) << @intCast(i);

                const ve_masked = place & vertical_east_moves_mask;
                const vw_masked = place & vertical_west_moves_mask;
                const he_masked = place & horizontal_east_moves_mask;
                const hw_masked = place & horizontal_west_moves_mask;

                const move_nne_sse: u64 = ve_masked >> 15 | ve_masked << 17;
                const move_nnw_ssw: u64 = vw_masked >> 17 | vw_masked << 15;
                const move_nee_see: u64 = he_masked >> 6 | he_masked << 10;
                const move_nww_sww: u64 = hw_masked >> 10 | hw_masked << 6;

                knight_moves[i] = move_nne_sse | move_nnw_ssw | move_nee_see | move_nww_sww;
            }
        }
    };

    if (static.knight_moves[0] == 0) {
        static.initKnightMoves();
    }

    const knight_index = @popCount(knight_place - 1);

    return ~b.getPlayer() & static.knight_moves[knight_index];
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

    const pawnmove = getMoveKnight(board, pos);

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

    const pawnmove = getMoveKnight(board, pos);

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

    const pawnmove = getMoveKnight(board, pos);

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

    const pawnmove = getMoveKnight(board, pos);

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
