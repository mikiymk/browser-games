const std = @import("std");
const Board = @import("Board.zig");
const Color = Board.Color;

const Game = @This();

pub const Move = struct {
    pub const MoveKindEnum = enum { move, promotion, enpassant, castling };
    pub const MoveKind = union(MoveKindEnum) {
        move: u0,
        promotion: enum { queen, rook, bishop, knight },
        enpassant: u64,
        castling: enum { king, queen },
    };

    kind: MoveKind,
    from: u64,
    to: u64,

    fn fromU32(serial: u32) Move {
        const kind_enum: MoveKindEnum = @enumFromInt((serial & 0xff000000) >> 24);
        const kind_index: u8 = @truncate((serial & 0x00ff0000) >> 16);

        const kind: MoveKind = switch (kind_enum) {
            .move => .{ .move = 0 },
            .promotion => .{ .promotion = @enumFromInt(kind_index) },
            .enpassant => .{ .enpassant = @as(u64, 1) << @truncate(kind_index) },
            .castling => .{ .castling = @enumFromInt(kind_index) },
        };

        const from_index: u6 = @truncate((serial & 0x0000ff00) >> 8);
        const to_index: u6 = @truncate(serial & 0x000000ff);

        const from = @as(u64, 1) << from_index;
        const to = @as(u64, 1) << to_index;

        return .{ .kind = kind, .from = from, .to = to };
    }

    fn toU32(move: Move) u32 {
        const kind: u32 = @intFromEnum(move.kind);
        const kind_index: u32 = switch (move.kind) {
            .move => 0,
            .promotion => |p| @intFromEnum(p),
            .enpassant => |e| @popCount(e - 1),
            .castling => |c| @intFromEnum(c),
        };

        const from_index: u32 = @popCount(move.from - 1);
        const to_index: u32 = @popCount(move.to - 1);

        return (kind << 24) | (kind_index << 16) | (from_index << 8) | to_index;
    }
};

test "move from u32" {
    const testing = std.testing;

    {
        const move = Move.fromU32(0x00_00_20_00);

        try testing.expectEqual(move.kind.move, 0);
        try testing.expectEqual(move.from, 0x00_00_00_01_00_00_00_00);
        try testing.expectEqual(move.to, 0x00_00_00_00_00_00_00_01);
        try testing.expectEqual(move.toU32(), 0x00_00_20_00);
    }

    {
        const promotion = Move.fromU32(0x01_01_20_00);

        try testing.expectEqual(promotion.kind.promotion, .rook);
        try testing.expectEqual(promotion.from, 0x00_00_00_01_00_00_00_00);
        try testing.expectEqual(promotion.to, 0x00_00_00_00_00_00_00_01);
        try testing.expectEqual(promotion.toU32(), 0x01_01_20_00);
    }

    {
        const enpassant = Move.fromU32(0x02_30_20_00);

        try testing.expectEqual(enpassant.kind.enpassant, 0x00_01_00_00_00_00_00_00);
        try testing.expectEqual(enpassant.from, 0x00_00_00_01_00_00_00_00);
        try testing.expectEqual(enpassant.to, 0x00_00_00_00_00_00_00_01);
        try testing.expectEqual(enpassant.toU32(), 0x02_30_20_00);
    }

    {
        const castling = Move.fromU32(0x03_00_20_00);

        try testing.expectEqual(castling.kind.castling, .king);
        try testing.expectEqual(castling.from, 0x00_00_00_01_00_00_00_00);
        try testing.expectEqual(castling.to, 0x00_00_00_00_00_00_00_01);
        try testing.expectEqual(castling.toU32(), 0x03_00_20_00);
    }
}

board: Board,
next_color: Color,

pub fn init() Game {
    return .{
        .board = Board.init(),
        .next_color = .white,
    };
}

pub fn end(game: Game) bool {
    return game.board.isCheckmate(.black) or game.board.isCheckmate(.white);
}
