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

const TestCase = struct {
    desc: []const u8,
    board: []const u8,
    expect_move_places: []const u8,
};

const black_pawn_cases = [_]TestCase{
    .{
        .desc = "first, move front 1 or 2",
        .board =
        \\........
        \\....P...
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\....o...
        \\....o...
        \\........
        \\........
        \\........
        \\........
        ,
    },
    .{
        .desc = "second or after, move front 1",
        .board =
        \\........
        \\........
        \\....P...
        \\........
        \\........
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
        \\........
        \\........
        ,
    },
    .{
        .desc = "if front ally, cannot move",
        .board =
        \\........
        \\....P...
        \\....N...
        \\........
        \\........
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        ,
    },
    .{
        .desc = "if front enemy, cannot move",
        .board =
        \\........
        \\....P...
        \\....n...
        \\........
        \\........
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        ,
    },
    .{
        .desc = "if left or right front enemy, can capture it",
        .board =
        \\........
        \\....P...
        \\...nbr..
        \\........
        \\........
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\...o.o..
        \\........
        \\........
        \\........
        \\........
        \\........
        ,
    },
    .{
        .desc = "multiple pawn moves",
        .board =
        \\........
        \\PPPP..PP
        \\....P...
        \\.....P..
        \\......n.
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\oooo..oo
        \\ooooo.oo
        \\.....oo.
        \\........
        \\........
        \\........
        ,
    },

    .{
        .desc = "edge pawn moves",
        .board =
        \\........
        \\.......P
        \\n.......
        \\P.......
        \\.......k
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\.......o
        \\.......o
        \\o.......
        \\........
        \\........
        \\........
        ,
    },
};

const white_pawn_cases = [_]TestCase{
    .{
        .desc = "first, move front 1 or 2",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....p...
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\....o...
        \\........
        \\........
        ,
    },
    .{
        .desc = "second or after, move front 1",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....p...
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
        \\........
        ,
    },
    .{
        .desc = "if front ally, cannot move",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....n...
        \\....p...
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        ,
    },
    .{
        .desc = "if front enemy, cannot move",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....N...
        \\....p...
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        ,
    },
    .{
        .desc = "if left or right front enemy, can capture it",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\...RBN..
        \\....p...
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\...o.o..
        \\........
        \\........
        ,
    },
    .{
        .desc = "multiple pawn moves",
        .board =
        \\........
        \\........
        \\........
        \\......N.
        \\.....p..
        \\....p...
        \\pppp..pp
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\.....oo.
        \\ooooo.oo
        \\oooo..oo
        \\........
        \\........
        ,
    },
    .{
        .desc = "edge pawn moves",
        .board =
        \\........
        \\........
        \\Q.......
        \\.......p
        \\........
        \\.......R
        \\p.......
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\.......o
        \\........
        \\o.......
        \\o.......
        \\........
        \\........
        ,
    },
};

const knight_cases = [_]TestCase{
    .{
        .desc = "8 place jump",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\....N...
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\...o.o..
        \\..o...o.
        \\........
        \\..o...o.
        \\...o.o..
        \\........
        ,
    },
    .{
        .desc = "2 squares from the edge",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\.....N..
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\....o.o.
        \\...o...o
        \\........
        \\...o...o
        \\....o.o.
        \\........
        ,
    },
    .{
        .desc = "1 square from the edge",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\......N.
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\.....o.o
        \\....o...
        \\........
        \\....o...
        \\.....o.o
        \\........
        ,
    },
    .{
        .desc = "on edge",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\.......N
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\......o.
        \\.....o..
        \\........
        \\.....o..
        \\......o.
        \\........
        ,
    },
    .{
        .desc = "pieces next to knight",
        .board =
        \\........
        \\........
        \\........
        \\...rqQ..
        \\...RNb..
        \\...pPB..
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\...o.o..
        \\..o...o.
        \\........
        \\..o...o.
        \\...o.o..
        \\........
        ,
    },
    .{
        .desc = "pieces at the landing point",
        .board =
        \\........
        \\........
        \\...q.Q..
        \\..p...B.
        \\....N...
        \\..P...b.
        \\...R.r..
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\...o....
        \\..o.....
        \\........
        \\......o.
        \\.....o..
        \\........
        ,
    },
    .{
        .desc = "multiple knights",
        .board =
        \\........
        \\........
        \\........
        \\...NN...
        \\...NN...
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\..oooo..
        \\.oooooo.
        \\.oo..oo.
        \\.oo..oo.
        \\.oooooo.
        \\..oooo..
        \\........
        ,
    },
};

const bishop_cases = [_]TestCase{
    .{
        .desc = "diagonal lines",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\....B...
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\o.......
        \\.o.....o
        \\..o...o.
        \\...o.o..
        \\........
        \\...o.o..
        \\..o...o.
        \\.o.....o
        ,
    },
    .{
        .desc = "on edge",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\.......B
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\...o....
        \\....o...
        \\.....o..
        \\......o.
        \\........
        \\......o.
        \\.....o..
        \\....o...
        ,
    },
    .{
        .desc = "on corner",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\.......B
        ,
        .expect_move_places =
        \\o.......
        \\.o......
        \\..o.....
        \\...o....
        \\....o...
        \\.....o..
        \\......o.
        \\........
        ,
    },
    .{
        .desc = "pieces on lines",
        .board =
        \\........
        \\........
        \\..q...Q.
        \\........
        \\....B...
        \\...r.R..
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\..o.....
        \\...o.o..
        \\........
        \\...o....
        \\........
        \\........
        ,
    },
    .{
        .desc = "multiple bishops",
        .board =
        \\........
        \\........
        \\........
        \\....B...
        \\....B...
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\oo.....o
        \\.oo...oo
        \\..oo.oo.
        \\...o.o..
        \\...o.o..
        \\..oo.oo.
        \\.oo...oo
        \\oo.....o
        ,
    },
};

const rook_cases = [_]TestCase{
    .{
        .desc = "vertical and horizontal lines",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\....R...
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\....o...
        \\....o...
        \\....o...
        \\....o...
        \\oooo.ooo
        \\....o...
        \\....o...
        \\....o...
        ,
    },
    .{
        .desc = "on edge",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\.......R
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\.......o
        \\.......o
        \\.......o
        \\.......o
        \\ooooooo.
        \\.......o
        \\.......o
        \\.......o
        ,
    },
    .{
        .desc = "on corner",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\R.......
        ,
        .expect_move_places =
        \\o.......
        \\o.......
        \\o.......
        \\o.......
        \\o.......
        \\o.......
        \\o.......
        \\.ooooooo
        ,
    },
    .{
        .desc = "pieces on lines",
        .board =
        \\........
        \\........
        \\....Q...
        \\........
        \\..q.RB..
        \\....b...
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\....o...
        \\..oo....
        \\....o...
        \\........
        \\........
        ,
    },
    .{
        .desc = "multiple rooks",
        .board =
        \\........
        \\........
        \\........
        \\....R...
        \\....R...
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\....o...
        \\....o...
        \\....o...
        \\oooo.ooo
        \\oooo.ooo
        \\....o...
        \\....o...
        \\....o...
        ,
    },
};

const queen_cases = [_]TestCase{
    .{
        .desc = "vertical horizontal and diagonal lines",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\....Q...
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\o...o...
        \\.o..o..o
        \\..o.o.o.
        \\...ooo..
        \\oooo.ooo
        \\...ooo..
        \\..o.o.o.
        \\.o..o..o
        ,
    },
    .{
        .desc = "on edge",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\.......Q
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\...o...o
        \\....o..o
        \\.....o.o
        \\......oo
        \\ooooooo.
        \\......oo
        \\.....o.o
        \\....o..o
        ,
    },
    .{
        .desc = "on corner",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\Q.......
        ,
        .expect_move_places =
        \\o......o
        \\o.....o.
        \\o....o..
        \\o...o...
        \\o..o....
        \\o.o.....
        \\oo......
        \\.ooooooo
        ,
    },
    .{
        .desc = "pieces on lines",
        .board =
        \\........
        \\........
        \\....R.n.
        \\...p....
        \\..r.QB..
        \\...Pb...
        \\......N.
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\......o.
        \\...ooo..
        \\..oo....
        \\....oo..
        \\........
        \\........
        ,
    },
    .{
        .desc = "multiple queens",
        .board =
        \\........
        \\........
        \\........
        \\...QQ...
        \\...QQ...
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\oo.oo.oo
        \\oooooooo
        \\.oooooo.
        \\ooo..ooo
        \\ooo..ooo
        \\.oooooo.
        \\oooooooo
        \\oo.oo.oo
        ,
    },
};

const king_cases = [_]TestCase{
    .{
        .desc = "move around",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\....K...
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\...ooo..
        \\...o.o..
        \\...ooo..
        \\........
        \\........
        ,
    },
    .{
        .desc = "on edge",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\.......K
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\......oo
        \\......o.
        \\......oo
        \\........
        \\........
        ,
    },
    .{
        .desc = "on corner",
        .board =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\K.......
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\oo......
        \\.o......
        ,
    },
    .{
        .desc = "pieces next to king",
        .board =
        \\........
        \\........
        \\........
        \\...pRn..
        \\...rKB..
        \\...PbN..
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\........
        \\...o.o..
        \\...o....
        \\....o...
        \\........
        \\........
        ,
    },
    .{
        .desc = "multiple kings",
        .board =
        \\........
        \\........
        \\........
        \\...KK...
        \\...KK...
        \\........
        \\........
        \\........
        ,
        .expect_move_places =
        \\........
        \\........
        \\..oooo..
        \\..o..o..
        \\..o..o..
        \\..oooo..
        \\........
        \\........
        ,
    },
};

fn testCases(cases: []const TestCase, char: u8, moves_fn: fn (board: Board, pawn_place: BitBoard, color: Board.Color) BitBoard) !void {
    var has_fail = false;

    for (cases) |case| {
        const board = Board.initWithString(case.board);
        const pos = BitBoard.initWithString(case.board, char);

        const pawnmove = moves_fn(board, pos, .black);

        pawnmove.expect(case.expect_move_places) catch {
            std.debug.print("test failed: {s}\n", .{case.desc});

            has_fail = true;
        };
    }

    if (has_fail) {
        return error.OneOrMoreTestCasesFailed;
    }
}

test "black pawn" {
    try testCases(&black_pawn_cases, 'P', moves.pawn);
}

test "white pawn" {
    var has_fail = false;

    inline for (white_pawn_cases) |case| {
        const board = Board.initWithString(case.board);
        const pos = BitBoard.initWithString(case.board, 'p');

        const pawnmove = moves.pawn(board, pos, .white);

        pawnmove.expect(case.expect_move_places) catch {
            std.debug.print("test failed: {s}\n", .{case.desc});

            has_fail = true;
        };
    }

    if (has_fail) {
        return error.OneOrMoreTestCasesFailed;
    }
}

test "knight" {
    try testCases(&knight_cases, 'N', moves.knight);
}

test "bishop" {
    try testCases(&bishop_cases, 'B', moves.bishop);
}

test "rook" {
    try testCases(&rook_cases, 'R', moves.rook);
}

test "queen" {
    try testCases(&queen_cases, 'Q', moves.queen);
}

test "king" {
    try testCases(&king_cases, 'K', moves.king);
}
