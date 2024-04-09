// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(9, 9);

// internal import
const main = @import("./main.zig");
const Game = main.Game;
const Board = main.Board;
const moves = main.moves;

pub const Move = union(enum) {
    move: struct { from: u81, to: u81 },
    hit: struct { piece: Game.PieceKind, to: u81 },
};

fn moveMove(from: u81, to: u81) Move {
    return .{ .move = .{ .from = from, .to = to } };
}

fn moveHit(piece: Game.PieceKind, to: u81) Move {
    return .{ .hit = .{ .piece = piece, .to = to } };
}

pub fn move(game: Game) Move {
    _ = game;

    return moveMove(0, 0);
}
