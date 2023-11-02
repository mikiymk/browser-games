const std = @import("std");

const bit_board = @import("bit-board");
const Board = @import("Board.zig");

pub fn getMoveKing(b: Board, knight_place: u64) u64 {
    const static = struct {
        const east_moves_mask = bit_board.fromString(
            \\ooooooo.
            \\ooooooo.
            \\ooooooo.
            \\ooooooo.
            \\ooooooo.
            \\ooooooo.
            \\ooooooo.
            \\ooooooo.
        , 'o');

        const west_moves_mask = bit_board.fromString(
            \\.ooooooo
            \\.ooooooo
            \\.ooooooo
            \\.ooooooo
            \\.ooooooo
            \\.ooooooo
            \\.ooooooo
            \\.ooooooo
        , 'o');

        var king_moves: [64]u64 = .{0} ** 64;

        pub fn initKnightMoves() void {
            for (0..64) |i| {
                const place = @as(u64, 1) << @intCast(i);

                const e_masked = place & east_moves_mask;
                const w_masked = place & west_moves_mask;

                const move_n_s: u64 = place >> 8 | place << 8;
                const move_e_ne_se: u64 = e_masked << 1 | e_masked << 9 | e_masked >> 7;
                const move_w_nw_sw: u64 = w_masked >> 1 | w_masked << 7 | w_masked >> 9;

                king_moves[i] = move_n_s | move_e_ne_se | move_w_nw_sw;
            }
        }
    };

    if (static.king_moves[0] == 0) {
        static.initKnightMoves();
    }

    const knight_index = @popCount(knight_place - 1);

    return ~b.getPlayer() & static.king_moves[knight_index];
}

test "get king's move 1: center" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\....k...
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'k');

    const pawnmove = getMoveKing(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\...ooo..
        \\...o.o..
        \\...ooo..
        \\........
        \\........
    );
}

test "get knight's move 2: edge" {
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\k.......
        \\........
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'k');

    const pawnmove = getMoveKing(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\oo......
        \\.o......
        \\oo......
        \\........
        \\........
    );
}

test "get knight's move 3: with other pieces" {
    const board_str =
        \\........
        \\........
        \\........
        \\...BRr..
        \\...bkp..
        \\...nNP..
        \\........
        \\........
    ;

    const board = Board.fromString(board_str);
    const pos = bit_board.fromString(board_str, 'k');

    const pawnmove = getMoveKing(board, pos);

    try bit_board.expectBitBoard(pawnmove,
        \\........
        \\........
        \\........
        \\...oo...
        \\........
        \\....oo..
        \\........
        \\........
    );
}
