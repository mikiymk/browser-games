// std import
const std = @import("std");
const builtin = @import("builtin");
const Random = std.rand.Random;
const assert = std.debug.assert;

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
    assert(@popCount(from) == 1);
    assert(@popCount(to) == 1);

    return .{ .move = .{ .from = from, .to = to } };
}

fn moveHit(piece: Game.PieceKind, to: u81) Move {
    assert(@popCount(to) == 1);

    return .{ .hit = .{ .piece = piece, .to = to } };
}

/// 自動で動かす手を決める関数
pub fn move(game: Game, r: Random) Move {
    console.log("ai move start", .{});

    if (r.boolean()) {
        // 持ち駒を打つ
        const piece = selectHandPiece(game, r);

        if (piece) |p| {
            const piece_kind = Game.PieceKind.fromPrimary(p, false);
            const area = game.hitPositions(p);
            const to = selectPlace(r, area);

            return moveHit(piece_kind, to);
        }
    }

    // 駒を動かす
    while (true) {
        const from_list = game.current_board.getColorPieces(game.current_player);
        const from = selectPlace(r, from_list);
        const to_list = game.movePositions(from);
        if (to_list == 0) {
            continue;
        }

        const to = selectPlace(r, to_list);

        return moveMove(from, to);
    }

    unreachable;
}

fn selectHandPiece(game: Game, r: Random) ?Game.PrimaryPiece {
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

    console.log("ai hands = {}, index = {}", .{ set, index });
    var i = set.iterator();
    while (i.next()) |hand| {
        if (index == 0) {
            return hand;
        }
        index -= 1;
    }

    unreachable;
}

fn selectPlace(r: Random, place: u81) u81 {
    console.log("select start\n{s}", .{BitBoard.toString(place, 'o', '.')});

    var index = r.intRangeLessThan(usize, 0, @popCount(place));
    var iter = BitBoard.iterator(place);

    while (iter.next()) |p| {
        if (index == 0) {
            console.log("selected\n{s}", .{BitBoard.toString(p, 'o', '.')});

            return p;
        }

        index -= 1;
    }

    unreachable;
}
