const std = @import("std");
const builtin = @import("builtin");

const allocator = if (builtin.target.isWasm()) std.heap.wasm_allocator else std.heap.page_allocator;

export fn add(a: u32, b: u32) u32 {
    return a +| b;
}

const Board = struct {};

const PieceKind = enum(u8) {
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

export fn init() *Board {
    @panic("not implemented");
}

export fn deinit(b: *Board) void {
    _ = b;

    @panic("not implemented");
}

export fn getPieces(b: *Board, kind: PieceKind) u64 {
    _ = b;
    _ = kind;

    @panic("not implemented");
}

export fn isBlack(b: *Board) bool {
    _ = b;

    @panic("not implemented");
}

export fn isEnd(b: *Board) bool {
    _ = b;

    @panic("not implemented");
}

export fn getMove(b: *Board, fromIndex: u8) u64 {
    _ = b;
    _ = fromIndex;

    @panic("not implemented");
}

export fn move(b: *Board, place: u8) void {
    _ = place;
    _ = b;

    @panic("not implemented");
}

export fn getAiMove(b: *Board) [*]u64 {
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
