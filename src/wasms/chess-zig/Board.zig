const std = @import("std");

const bit_board = @import("bit-board");

const move_pawn = @import("move_pawn.zig");
const move_knight = @import("move_knight.zig");
const move_bishop = @import("move_bishop.zig");
const move_rook = @import("move_rook.zig");
const move_queen = @import("move_queen.zig");
const move_king = @import("move_king.zig");

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
pub const Piece = enum { pawn, knight, bishop, rook, queen, king };

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
    if (b.black_pawn & from != 0) {
        return move_pawn.getMovePawnBlack(b, from);
    } else if (b.white_pawn & from != 0) {
        return move_pawn.getMovePawnWhite(b, from);
    } else if ((b.black_knight | b.white_knight) & from != 0) {
        return move_knight.getMoveKnight(b, from);
    } else if ((b.black_bishop | b.white_bishop) & from != 0) {
        return move_bishop.getMoveBishop(b, from);
    } else if ((b.black_rook | b.white_rook) & from != 0) {
        return move_rook.getMoveRook(b, from);
    } else if ((b.black_queen | b.white_queen) & from != 0) {
        return move_queen.getMoveQueen(b, from);
    } else if ((b.black_king | b.white_king) & from != 0) {
        return move_king.getMoveKing(b, from);
    }

    return 0;
}

/// 盤がチェック状態になっているか
/// - color - チェックされるキングの色
fn isChecked(b: Board, color: Color) bool {
    var king: u64 = undefined;

    var danger_zone: u64 = undefined;

    if (color == .black) {
        king = b.black_king;

        danger_zone = move_king.getMoveKing(b, b.white_king) |
            move_queen.getMoveQueen(b, b.white_queen) |
            move_rook.getMoveRook(b, b.white_rook) |
            move_bishop.getMoveBishop(b, b.white_bishop) |
            move_knight.getMoveKnight(b, b.white_knight) |
            move_pawn.getMovePawnWhite(b, b.white_pawn);
    } else {
        king = b.white_king;

        danger_zone = move_king.getMoveKing(b, b.black_king) |
            move_queen.getMoveQueen(b, b.black_queen) |
            move_rook.getMoveRook(b, b.black_rook) |
            move_bishop.getMoveBishop(b, b.black_bishop) |
            move_knight.getMoveKnight(b, b.black_knight) |
            move_pawn.getMovePawnBlack(b, b.black_pawn);
    }

    return king & danger_zone != 0;
}

test "black king is checked" {
    const board = fromString(
        \\........
        \\...q....
        \\........
        \\........
        \\...K....
        \\........
        \\........
        \\........
    );

    const actual = board.isChecked(.black);
    const expected = true;

    try std.testing.expect(actual == expected);
}

test "black king is not checked" {
    const board = fromString(
        \\........
        \\..q.....
        \\........
        \\........
        \\...K....
        \\........
        \\........
        \\........
    );

    const actual = board.isChecked(.black);
    const expected = false;

    try std.testing.expect(actual == expected);
}

/// ボードから動いた状態の新しいボードを作成する。
/// 1. 移動元と移動先のマスを空にする。
/// 2. 移動先のマスを指定のピースにする。
pub fn getMovedBoard(b: Board, from: u64, to: u64, color: Color, piece: Piece) Board {
    var new_board = b;
    const reset_board = ~(from | to);

    new_board.black_pawn &= reset_board;
    new_board.black_knight &= reset_board;
    new_board.black_bishop &= reset_board;
    new_board.black_rook &= reset_board;
    new_board.black_queen &= reset_board;
    new_board.black_king &= reset_board;
    new_board.white_pawn &= reset_board;
    new_board.white_knight &= reset_board;
    new_board.white_bishop &= reset_board;
    new_board.white_rook &= reset_board;
    new_board.white_queen &= reset_board;
    new_board.white_king &= reset_board;

    switch (piece) {
        .pawn => if (color == .black) {
            new_board.black_pawn |= to;
        } else {
            new_board.white_pawn |= to;
        },
        .knight => if (color == .black) {
            new_board.black_knight |= to;
        } else {
            new_board.white_knight |= to;
        },
        .bishop => if (color == .black) {
            new_board.black_bishop |= to;
        } else {
            new_board.white_bishop |= to;
        },
        .rook => if (color == .black) {
            new_board.black_rook |= to;
        } else {
            new_board.white_rook |= to;
        },
        .queen => if (color == .black) {
            new_board.black_queen |= to;
        } else {
            new_board.white_queen |= to;
        },
        .king => if (color == .black) {
            new_board.black_king |= to;
        } else {
            new_board.white_king |= to;
        },
    }

    return new_board;
}

test "moved board 1: single pawn" {
    const board = fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....p...
        \\........
        \\........
    );

    const from = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
    , 'o');

    const to = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    , 'o');

    const actual = board.getMovedBoard(from, to, .white, .pawn);

    try bit_board.expectBitBoard(actual.white_pawn,
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    );
}

test "moved board 2: multiple pawns" {
    const board = fromString(
        \\........
        \\pppp.ppp
        \\........
        \\........
        \\........
        \\....p...
        \\........
        \\........
    );

    const from = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
    , 'o');

    const to = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    , 'o');

    const actual = board.getMovedBoard(from, to, .white, .pawn);

    try bit_board.expectBitBoard(actual.white_pawn,
        \\........
        \\oooo.ooo
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    );
}

test "moved board 3: pawns and other pieces" {
    const board = fromString(
        \\rnbqkbnr
        \\pppp.ppp
        \\........
        \\........
        \\........
        \\....p...
        \\........
        \\........
    );

    const from = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
    , 'o');

    const to = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    , 'o');

    const actual = board.getMovedBoard(from, to, .white, .pawn);

    try bit_board.expectBitBoard(actual.white_pawn,
        \\........
        \\oooo.ooo
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
    );

    try bit_board.expectBitBoard(actual.white_knight,
        \\.o....o.
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

test "moved board 4: capture" {
    const board = fromString(
        \\rnbqkbnr
        \\pppp.ppp
        \\........
        \\........
        \\........
        \\....p...
        \\..PP....
        \\........
    );

    const from = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
    , 'o');

    const to = bit_board.fromString(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\...o....
        \\........
    , 'o');

    const actual = board.getMovedBoard(from, to, .white, .pawn);

    try bit_board.expectBitBoard(actual.white_pawn,
        \\........
        \\oooo.ooo
        \\........
        \\........
        \\........
        \\........
        \\...o....
        \\........
    );

    try bit_board.expectBitBoard(actual.black_pawn,
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\..o.....
        \\........
    );
}
