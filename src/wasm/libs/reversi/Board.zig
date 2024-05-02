// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

// internal import

// test import
test {
    _ = @import("./Board.test.zig");
}

// 1 << n
//
//  63 62 61 60 59 58 57 56
//  55 54 53 52 51 50 49 48
//  47 46 45 44 43 42 41 40
//  39 38 37 36 35 34 33 32
//  31 30 29 28 27 26 25 24
//  23 22 21 20 19 18 17 16
//  15 14 13 12 11 10  9  8
//   7  6  5  4  3  2  1  0

const Board = @This();

// properties

/// 黒のビットボード
black: BitBoard.Board = BitBoard.Board.initEmpty(),

/// 白のビットボード
white: BitBoard.Board = BitBoard.Board.initEmpty(),

/// 次に打つ色
nextColor: Color = .black,

/// プレイヤーの色のリスト。黒か白か
pub const Color = enum(u1) {
    black,
    white,

    /// 黒なら白、白なら黒。
    /// 現在の逆の色を返す
    pub fn turn(c: Color) Color {
        return switch (c) {
            .black => .white,
            .white => .black,
        };
    }
};

/// ボードの初期状態を作る
pub fn init() Board {
    return fromString(
        \\........
        \\........
        \\........
        \\...xo...
        \\...ox...
        \\........
        \\........
        \\........
    );
}

/// 現在のプレイヤー側のビットボードを取得する
pub fn getPlayer(b: Board) BitBoard.Board {
    return switch (b.nextColor) {
        .black => b.black,
        .white => b.white,
    };
}

/// 現在の相手側のビットボードを取得する
pub fn getOpponent(b: Board) BitBoard.Board {
    return switch (b.nextColor) {
        .black => b.white,
        .white => b.black,
    };
}

/// 場所に置いた時、ひっくり返す石を求める
fn getFlipSquares(b: Board, place: BitBoard.Board) BitBoard.Board {
    const player_board = b.getPlayer();
    const opponent_board = b.getOpponent();

    const mask = opponent_board.intersectWith(BitBoard.fromString(
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
    , 'o'));

    const flip =
        moveDir(player_board, place, mask, .e)
        .unionWith(moveDir(player_board, place, mask, .w))
        .unionWith(moveDir(player_board, place, opponent_board, .n))
        .unionWith(moveDir(player_board, place, opponent_board, .s))
        .unionWith(moveDir(player_board, place, mask, .ne))
        .unionWith(moveDir(player_board, place, mask, .sw))
        .unionWith(moveDir(player_board, place, mask, .nw))
        .unionWith(moveDir(player_board, place, mask, .se));

    return flip;
}

/// Placeで示された場所に石を置く。
/// 既に置いてある石でひっくり返す石がある場合は、それをひっくり返す。
/// ボードを更新する
pub fn moveMutate(b: *Board, place: BitBoard.Board) void {
    const flip = b.getFlipSquares(place);

    b.black.toggleSet(flip);
    b.white.toggleSet(flip);

    if (b.nextColor == .black) {
        b.black.setUnion(place);
    } else {
        b.white.setUnion(place);
    }
}

/// Placeで示された場所に石を置く。
/// 既に置いてある石でひっくり返す石がある場合は、それをひっくり返す。
/// ボードを更新する
pub fn move(b: Board, place: BitBoard.Board) Board {
    const flip = b.getFlipSquares(place);

    var black = b.black.xorWith(flip);
    var white = b.white.xorWith(flip);

    if (b.nextColor == .black) {
        black.set(place.findFirstSet() orelse unreachable);
    } else {
        white.set(place.findFirstSet() orelse unreachable);
    }

    var new_board = Board{
        .black = black,
        .white = white,
        .nextColor = b.nextColor.turn(),
    };

    if (new_board.getValidMoves().eql(BitBoard.Board.initEmpty())) {
        new_board.nextColor = new_board.nextColor.turn();
    }

    return new_board;
}

/// Dirで示された方向にひっくり返す石を探す。
fn moveDir(player_board: BitBoard.Board, place: BitBoard.Board, mask: BitBoard.Board, dir: BitBoard.Direction) BitBoard.Board {
    var flip = BitBoard.move(place, dir).intersectWith(mask);
    flip.setUnion(BitBoard.move(flip, dir).intersectWith(mask));
    flip.setUnion(BitBoard.move(flip, dir).intersectWith(mask));
    flip.setUnion(BitBoard.move(flip, dir).intersectWith(mask));
    flip.setUnion(BitBoard.move(flip, dir).intersectWith(mask));
    flip.setUnion(BitBoard.move(flip, dir).intersectWith(mask));

    if (!BitBoard.isEmpty(BitBoard.move(flip, dir).intersectWith(player_board))) {
        // 先にプレイヤーの石があれば、ひっくり返せる
        return flip;
    }

    return BitBoard.Board.initEmpty();
}

/// 石を置ける場所のリストを作成する
pub fn getValidMoves(b: Board) BitBoard.Board {
    const player_board = b.getPlayer();
    const opponent_board = b.getOpponent();
    var empty = player_board.unionWith(opponent_board);
    empty.toggleAll();

    const mask = opponent_board.intersectWith(BitBoard.fromString(
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
        \\.oooooo.
    , 'o'));

    return getDirMoves(player_board, mask, .ew)
        .unionWith(getDirMoves(player_board, opponent_board, .ns))
        .unionWith(getDirMoves(player_board, mask, .nesw))
        .unionWith(getDirMoves(player_board, mask, .nwse))
        .intersectWith(empty);
}

/// Dirで示された方向に挟める場所を探す
fn getDirMoves(board: BitBoard.Board, mask: BitBoard.Board, dir: BitBoard.Direction) BitBoard.Board {
    var flip = board;
    flip = BitBoard.move(flip, dir).intersectWith(mask);

    flip.setUnion(BitBoard.move(flip, dir).intersectWith(mask));
    flip.setUnion(BitBoard.move(flip, dir).intersectWith(mask));
    flip.setUnion(BitBoard.move(flip, dir).intersectWith(mask));
    flip.setUnion(BitBoard.move(flip, dir).intersectWith(mask));
    flip.setUnion(BitBoard.move(flip, dir).intersectWith(mask));

    return BitBoard.move(flip, dir);
}

/// ゲームが終了しているか判定する。
/// どちらのプレイヤーも置く場所がなかったら終了
pub fn isEnd(b: Board) bool {
    if (!b.getValidMoves().eql(BitBoard.Board.initEmpty())) {
        return false;
    }

    const pass_board = Board{
        .black = b.black,
        .white = b.white,
        .nextColor = b.nextColor.turn(),
    };

    return pass_board.getValidMoves().eql(BitBoard.Board.initEmpty());
}

/// ボードの文字列からボード構造体を作る
/// oが黒石、xが白石、それ以外で空白を表す。
pub fn fromString(comptime str: []const u8) Board {
    return .{
        .black = BitBoard.fromString(str, 'o'),
        .white = BitBoard.fromString(str, 'x'),
    };
}
