// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(9, 9);
const console = common.console;

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

pub fn move(game: Game, r: std.rand.Random) Move {
    console.log("ai move start", .{});

    if (r.boolean()) {
        // 持ち駒を打つ
        const piece = selectHandPiece(game, r);

        if (piece) |p| {
            const piece_kind = Game.PieceKind.fromPrimary(p, false);
            const area = hitArea(game, piece_kind);
            const to = selectPlace(r, area);

            return moveHit(piece_kind, to);
        }
    }

    // 駒を動かす
    const from_list = game.current_board.getColorPieces(game.current_player);
    const from = selectPlace(r, from_list);
    const to_list = moves.move(game.current_board, from);
    const to = selectPlace(r, to_list);

    return moveMove(from, to);
}

fn selectHandPiece(game: Game, r: std.rand.Random) ?Game.PrimaryPiece {
    var hands = game.getHandPtr(game.current_player);
    var set = std.EnumSet(Game.PrimaryPiece).initEmpty();
    var hands_iter = hands.iterator();
    while (hands_iter.next()) |hand| {
        if (hand.value.* > 0) {
            set.insert(hand.key);
        }
    }
    const count = set.count();
    if (count == 0) {
        return null;
    }

    var index = r.intRangeLessThan(usize, 0, count);
    var i = set.iterator();
    while (i.next()) |hand| {
        if (index == 0) {
            return hand;
        }
        index -= 1;
    }

    unreachable;
}

fn hitArea(game: Game, piece: Game.PieceKind) u81 {
    const normal_area = ~@as(u81, 0);
    const black_knight_area = ~Board.black_farest2;
    const black_pawn_area = ~Board.black_farest;
    const white_knight_area = ~Board.white_farest2;
    const white_pawn_area = ~Board.white_farest;

    const area = switch (piece) {
        .pawn, .lance => switch (game.current_player) {
            .black => black_pawn_area,
            .white => white_pawn_area,
        },
        .knight => switch (game.current_player) {
            .black => black_knight_area,
            .white => white_knight_area,
        },
        else => normal_area,
    };

    const black_pieces = game.current_board.getColorPieces(.black);
    const white_pieces = game.current_board.getColorPieces(.white);
    const empty = ~(black_pieces | white_pieces);

    return area & empty;
}

fn selectPlace(r: std.rand.Random, place: u81) u81 {
    var index = r.intRangeLessThan(usize, 0, @popCount(place));
    var iter = BitBoard.iterator(place);

    while (iter.next()) |p| {
        if (index == 0) {
            return p;
        }

        index -= 1;
    }

    unreachable;
}
