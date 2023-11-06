const std = @import("std");
const builtin = @import("builtin");

pub const Board = @import("Board.zig");
pub const Game = @import("Game.zig");
const PieceKind = Board.ColorPieceType;

const allocator = if (builtin.target.isWasm()) std.heap.wasm_allocator else std.heap.page_allocator;

export fn add(a: u32, b: u32) u32 {
    return a +| b;
}

export fn init() ?*Game {
    const game_ptr = allocator.create(Game) catch return null;
    game_ptr.* = Game.init();

    return game_ptr;
}

export fn deinit(g: ?*Game) void {
    if (g) |game_ptr| {
        allocator.destroy(game_ptr);
    }
}

export fn setPiece(g: *Game, kind: PieceKind, place: u8) void {
    g.board.setPiece(kind, @as(u64, 1) << @truncate(place));
}

export fn getPiece(g: *Game, kind: PieceKind) u64 {
    return g.board.getPieces(kind);
}

export fn isBlack(g: *Game) bool {
    return g.next_color == .black;
}

export fn isEnd(g: *Game) bool {
    return g.end();
}

export fn getMove(g: *Game, from_index: u8) u64 {
    const from_place = @as(u64, 1) << @as(u6, @truncate(from_index));

    return g.board.getMove(from_place);
}

export fn move(g: *Game, from_index: u8, to_index: u8) void {
    const color_piece_type = g.board.getColorType(from_index) orelse return;

    g.board = g.board.getMovedBoard(from_index, to_index, color_piece_type.color(), color_piece_type.pieceType());
}

export fn getAiMove(g: *Game) u16 {
    _ = g;

    @panic("not implemented");
}

test {
    const testing = std.testing;

    testing.refAllDecls(@This());

    _ = @import("./moves_test.zig");
}

test "add test" {
    const testing = std.testing;

    try testing.expect(add(3, 4) == 7);
}
