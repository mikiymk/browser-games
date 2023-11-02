const std = @import("std");

const bit_board = @import("bit-board");

const Board = @This();

pub const PieceKind = enum(u8) {
    black_pawn = 1,
    black_knight = 2,
    black_bishop = 3,
    black_rook = 4,
    black_queen = 5,
    black_king = 6,

    white_pawn = 7,
    white_knight = 8,
    white_bishop = 9,
    white_rook = 10,
    white_queen = 11,
    white_king = 12,
};

pub const Color = enum(u1) { black, white };

next_color: Color = .white,

black_pawn: u64,
black_knight: u64,
black_bishop: u64,
black_rook: u64,
black_queen: u64,
black_king: u64,

white_pawn: u64,
white_knight: u64,
white_bishop: u64,
white_rook: u64,
white_queen: u64,
white_king: u64,

pub fn init() Board {
    return fromString(
        \\rnbqkbnr
        \\pppppppp
        \\........
        \\........
        \\........
        \\........
        \\PPPPPPPP
        \\RNBQKBNR
    );
}

test "chess board from string" {
    const board = fromString(
        \\rnbqkbnr
        \\pppppppp
        \\........
        \\........
        \\........
        \\........
        \\PPPPPPPP
        \\RNBQKBNR
    );

    try bit_board.expectBitBoard(board.black_pawn,
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\oooooooo
        \\........
    );

    try bit_board.expectBitBoard(board.white_rook,
        \\o......o
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

fn fromString(comptime str: []const u8) Board {
    return .{
        .black_pawn = bit_board.fromString(str, 'P'),
        .black_knight = bit_board.fromString(str, 'N'),
        .black_bishop = bit_board.fromString(str, 'B'),
        .black_rook = bit_board.fromString(str, 'R'),
        .black_queen = bit_board.fromString(str, 'Q'),
        .black_king = bit_board.fromString(str, 'K'),

        .white_pawn = bit_board.fromString(str, 'p'),
        .white_knight = bit_board.fromString(str, 'n'),
        .white_bishop = bit_board.fromString(str, 'b'),
        .white_rook = bit_board.fromString(str, 'r'),
        .white_queen = bit_board.fromString(str, 'q'),
        .white_king = bit_board.fromString(str, 'k'),
    };
}

fn getBlack(b: Board) u64 {
    return b.black_pawn |
        b.black_knight |
        b.black_bishop |
        b.black_rook |
        b.black_queen |
        b.black_king;
}

fn getWhite(b: Board) u64 {
    return b.white_pawn |
        b.white_knight |
        b.white_bishop |
        b.white_rook |
        b.white_queen |
        b.white_king;
}

fn getPlayer(b: Board) u64 {
    _ = b;
    return;
}

fn getOpponent(b: Board) u64 {
    _ = b;
}

pub fn getMove(b: Board, from: u64) u64 {
    if (b.black_pawn & from != 0) {
        return b.getMovePawnBlack(from);
    } else if (b.white_pawn & from != 0) {
        return b.getMovePawnWhite(from);
    } else if ((b.black_knight | b.white_knight) & from != 0) {
        return b.getMoveKnight(from);
    } else if ((b.black_bishop | b.white_bishop) & from != 0) {
        return b.getMoveBishop(from);
    } else if ((b.black_rook | b.white_rook) & from != 0) {
        return b.getMoveRook(from);
    } else if ((b.black_queen | b.white_queen) & from != 0) {
        return b.getMoveQueen(from);
    } else if ((b.black_king | b.white_king) & from != 0) {
        return b.getMoveKing(from);
    }

    return 0;
}

fn getMovePawnBlack(b: Board, from: u64) u64 {
    const pawn = b.black_pawn & from;

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

    const white_pieces = b.white_pawn | b.white_knight | b.white_bishop | b.white_rook | b.white_queen | b.white_king;
    const black_pieces = b.black_pawn | b.black_knight | b.black_bishop | b.black_rook | b.black_queen | b.black_king;
    const empties = ~(white_pieces | black_pieces);

    // 前一
    const move_n: u64 = (pawn >> 8) & empties;
    const move_n2: u64 = (move_n >> 8) & empties & move_n2_dests;
    const move_ne_nw: u64 = (pawn >> 7 | pawn >> 9) & white_pieces;

    return move_n | move_n2 | move_ne_nw;
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

    const board = fromString(board_str);
    const pos = bit_board.fromString(board_str, 'P');

    const pawnmove = board.getMovePawnBlack(pos);

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

    const board = fromString(board_str);
    const pos = bit_board.fromString(board_str, 'P');

    const pawnmove = board.getMovePawnBlack(pos);

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

    const board = fromString(board_str);
    const pos = bit_board.fromString(board_str, 'P');

    const pawnmove = board.getMovePawnBlack(pos);

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

    const board = fromString(board_str);
    const pos = bit_board.fromString(board_str, 'P');

    const pawnmove = board.getMovePawnBlack(pos);

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

fn getMovePawnWhite(b: Board, from: u64) u64 {
    _ = from;
    _ = b;

    @panic("not implemented");
}

fn getMoveKnight(b: Board, from: u64) u64 {
    _ = from;
    _ = b;

    @panic("not implemented");
}

fn getMoveBishop(b: Board, from: u64) u64 {
    _ = from;
    _ = b;

    @panic("not implemented");
}

fn getMoveRook(b: Board, from: u64) u64 {
    _ = from;
    _ = b;

    @panic("not implemented");
}

fn getMoveQueen(b: Board, from: u64) u64 {
    _ = from;
    _ = b;

    @panic("not implemented");
}

fn getMoveKing(b: Board, from: u64) u64 {
    _ = from;
    _ = b;

    @panic("not implemented");
}
