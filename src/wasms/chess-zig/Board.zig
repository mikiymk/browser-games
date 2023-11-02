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

pub fn fromString(comptime str: []const u8) Board {
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

pub fn getBlack(b: Board) u64 {
    return b.black_pawn |
        b.black_knight |
        b.black_bishop |
        b.black_rook |
        b.black_queen |
        b.black_king;
}

pub fn getWhite(b: Board) u64 {
    return b.white_pawn |
        b.white_knight |
        b.white_bishop |
        b.white_rook |
        b.white_queen |
        b.white_king;
}

pub fn getPlayer(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.getBlack(),
        .white => b.getWhite(),
    };
}

pub fn getOpponent(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.getWhite(),
        .white => b.getBlack(),
    };
}

pub fn getPlayerPawn(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.black_pawn,
        .white => b.white_pawn,
    };
}

pub fn getOpponentPawn(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.white_pawn,
        .white => b.black_pawn,
    };
}

pub fn getPlayerKnight(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.black_knight,
        .white => b.white_knight,
    };
}

pub fn getOpponentKnight(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.white_knight,
        .white => b.black_knight,
    };
}

pub fn getPlayerBishop(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.black_bishop,
        .white => b.white_bishop,
    };
}

pub fn getOpponentBishop(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.white_bishop,
        .white => b.black_bishop,
    };
}

pub fn getPlayerRook(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.black_rook,
        .white => b.white_rook,
    };
}

pub fn getOpponentRook(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.white_rook,
        .white => b.black_rook,
    };
}

pub fn getPlayerQueen(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.black_queen,
        .white => b.white_queen,
    };
}

pub fn getOpponentQueen(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.white_queen,
        .white => b.black_queen,
    };
}

pub fn getPlayerKing(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.black_king,
        .white => b.white_king,
    };
}

pub fn getOpponentKing(b: Board) u64 {
    return switch (b.next_color) {
        .black => b.white_king,
        .white => b.black_king,
    };
}

pub fn getMove(b: Board, from: u64) u64 {
    const move_pawn = @import("move_pawn.zig");
    const move_knight = @import("move_knight.zig");
    const move_bishop = @import("move_bishop.zig");

    if (b.black_pawn & from != 0) {
        return move_pawn.getMovePawnBlack(b, from);
    } else if (b.white_pawn & from != 0) {
        return move_pawn.getMovePawnWhite(b, from);
    } else if ((b.black_knight | b.white_knight) & from != 0) {
        return move_knight.getMoveKnight(b, from);
    } else if ((b.black_bishop | b.white_bishop) & from != 0) {
        return move_bishop.getMoveBishop(b, from);
    } else if ((b.black_rook | b.white_rook) & from != 0) {
        return b.getMoveRook(from);
    } else if ((b.black_queen | b.white_queen) & from != 0) {
        return b.getMoveQueen(from);
    } else if ((b.black_king | b.white_king) & from != 0) {
        return b.getMoveKing(from);
    }

    return 0;
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
