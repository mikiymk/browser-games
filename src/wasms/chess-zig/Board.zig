const std = @import("std");

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

next_color: Color,

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
    return .{
        .black_pawn = 0,
        .black_knight = 0,
        .black_bishop = 0,
        .black_rook = 0,
        .black_queen = 0,
        .black_king = 0,

        .white_pawn = 0,
        .white_knight = 0,
        .white_bishop = 0,
        .white_rook = 0,
        .white_queen = 0,
        .white_king = 0,
    };
}
