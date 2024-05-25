// std import
const std = @import("std");
const builtin = @import("builtin");
const Random = std.rand.Random;
const assert = std.debug.assert;

// common import
const common = @import("../common/main.zig");

// internal import
const main = @import("./main.zig");
const Game = main.Game;
const Board = main.Board;
const moves = main.moves;

const BitBoard = Board.BitBoard;
const Piece = Board.Piece;
const PromotionPiece = Board.PromotionPiece;

test {
    _ = @import("./ai.test.zig");
}

pub const Move = union(enum) {
    move: struct { from: BitBoard, to: BitBoard },
    hit: struct { piece: PromotionPiece, to: BitBoard },
};

fn moveMove(from: BitBoard, to: BitBoard) Move {
    assert(from.count() == 1);
    assert(to.count() == 1);

    return .{ .move = .{ .from = from, .to = to } };
}

fn moveHit(piece: PromotionPiece, to: BitBoard) Move {
    assert(to.count() == 1);

    return .{ .hit = .{ .piece = piece, .to = to } };
}

/// 自動で動かす手を決める関数
pub fn move(game: Game, r: Random) Move {
    if (r.boolean()) {
        // 持ち駒を打つ
        const piece = selectHandPiece(game, r);

        if (piece) |p| {
            const piece_kind = PromotionPiece.fromPiece(p, .normal);
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
        if (to_list.isEmpty()) {
            continue;
        }

        const to = selectPlace(r, to_list);

        return moveMove(from, to);
    }

    unreachable;
}

fn selectHandPiece(game: Game, r: Random) ?Piece {
    var hands = game.getHandPtr(game.current_player);
    var set = std.EnumSet(Piece).initEmpty();
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

fn selectPlace(r: Random, place: BitBoard) BitBoard {
    var index = r.intRangeLessThan(usize, 0, place.count());
    var iter = place.iterator();

    while (iter.next()) |p| {
        if (index == 0) {
            return BitBoard.fromIndex(p);
        }

        index -= 1;
    }

    unreachable;
}
