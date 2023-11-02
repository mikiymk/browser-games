const std = @import("std");
const builtin = @import("builtin");

pub const Board = @import("Board.zig");
const PieceKind = Board.PieceKind;

const allocator = if (builtin.target.isWasm()) std.heap.wasm_allocator else std.heap.page_allocator;

export fn add(a: u32, b: u32) u32 {
    return a +| b;
}

export fn init() ?*Board {
    const board_pointer = allocator.create(Board) catch return null;
    board_pointer.* = Board.init();

    return board_pointer;
}

export fn deinit(b: ?*Board) void {
    if (b) |board_pointer| {
        allocator.destroy(board_pointer);
    }
}

export fn setPieces(b: *Board, kind: PieceKind, pieces: u64) void {
    switch (kind) {
        .black_pawn => b.black_pawn = pieces,
        .black_knight => b.black_knight = pieces,
        .black_bishop => b.black_bishop = pieces,
        .black_rook => b.black_rook = pieces,
        .black_queen => b.black_queen = pieces,
        .black_king => b.black_king = pieces,

        .white_pawn => b.white_pawn = pieces,
        .white_knight => b.white_knight = pieces,
        .white_bishop => b.white_bishop = pieces,
        .white_rook => b.white_rook = pieces,
        .white_queen => b.white_queen = pieces,
        .white_king => b.white_king = pieces,
    }
}

export fn getPieces(b: *Board, kind: PieceKind) u64 {
    return switch (kind) {
        .black_pawn => b.black_pawn,
        .black_knight => b.black_knight,
        .black_bishop => b.black_bishop,
        .black_rook => b.black_rook,
        .black_queen => b.black_queen,
        .black_king => b.black_king,

        .white_pawn => b.white_pawn,
        .white_knight => b.white_knight,
        .white_bishop => b.white_bishop,
        .white_rook => b.white_rook,
        .white_queen => b.white_queen,
        .white_king => b.white_king,
    };
}

export fn isBlack(b: *Board) bool {
    return b.next_color == .black;
}

export fn isEnd(b: *Board) bool {
    _ = b;

    @panic("not implemented");
}

export fn getMove(b: *Board, from_index: u8) u64 {
    const from_place = @as(u64, 1) << @as(u6, @truncate(from_index));

    return b.getMove(from_place);
}

export fn move(b: *Board, from_index: u8, to_index: u8) void {
    _ = b;
    _ = from_index;
    _ = to_index;

    @panic("not implemented");
}

export fn getAiMove(b: *Board) u16 {
    _ = b;

    @panic("not implemented");
}

test {
    const testing = std.testing;

    testing.refAllDecls(@This());
}

test "add test" {
    const testing = std.testing;

    try testing.expect(add(3, 4) == 7);
}
