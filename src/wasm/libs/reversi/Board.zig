// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("../common/main.zig");
pub const BitBoard = common.bit_board.BitBoard(8, 8);

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
black: BitBoard = BitBoard.init(),

/// 白のビットボード
white: BitBoard = BitBoard.init(),

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
pub fn getPlayer(b: Board) BitBoard {
    return switch (b.nextColor) {
        .black => b.black,
        .white => b.white,
    };
}

/// 現在の相手側のビットボードを取得する
pub fn getOpponent(b: Board) BitBoard {
    return switch (b.nextColor) {
        .black => b.white,
        .white => b.black,
    };
}

/// 場所に置いた時、ひっくり返す石を求める
fn getFlipSquares(b: Board, place: BitBoard) BitBoard {
    const player_board = b.getPlayer();
    const opponent_board = b.getOpponent();

    const mask = opponent_board.masks(BitBoard.fromString(
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
        .unions(moveDir(player_board, place, mask, .w))
        .unions(moveDir(player_board, place, opponent_board, .n))
        .unions(moveDir(player_board, place, opponent_board, .s))
        .unions(moveDir(player_board, place, mask, .ne))
        .unions(moveDir(player_board, place, mask, .sw))
        .unions(moveDir(player_board, place, mask, .nw))
        .unions(moveDir(player_board, place, mask, .se));

    return flip;
}

/// Placeで示された場所に石を置く。
/// 既に置いてある石でひっくり返す石がある場合は、それをひっくり返す。
/// ボードを更新する
pub fn moveMutate(b: *Board, place: BitBoard) void {
    const flip = b.getFlipSquares(place);

    b.black.setToggle(flip);
    b.white.setToggle(flip);

    if (b.nextColor == .black) {
        b.black.setUnion(place);
    } else {
        b.white.setUnion(place);
    }
}

/// Placeで示された場所に石を置く。
/// 既に置いてある石でひっくり返す石がある場合は、それをひっくり返す。
/// ボードを更新する
pub fn move(b: Board, place: BitBoard) Board {
    const flip = b.getFlipSquares(place);

    var black = b.black.toggled(flip);
    var white = b.white.toggled(flip);

    if (b.nextColor == .black) {
        black.setUnion(place);
    } else {
        white.setUnion(place);
    }

    var new_board = Board{
        .black = black,
        .white = white,
        .nextColor = b.nextColor.turn(),
    };

    if (new_board.getValidMoves().isEmpty()) {
        new_board.nextColor = new_board.nextColor.turn();
    }

    return new_board;
}

/// Dirで示された方向にひっくり返す石を探す。
fn moveDir(player_board: BitBoard, place: BitBoard, mask: BitBoard, dir: BitBoard.Direction) BitBoard {
    var flip = place.move(dir).masks(mask);
    flip.setUnion(flip.move(dir).masks(mask));
    flip.setUnion(flip.move(dir).masks(mask));
    flip.setUnion(flip.move(dir).masks(mask));
    flip.setUnion(flip.move(dir).masks(mask));
    flip.setUnion(flip.move(dir).masks(mask));

    if (!flip.move(dir).masks(player_board).isEmpty()) {
        // 先にプレイヤーの石があれば、ひっくり返せる
        return flip;
    }

    return BitBoard.init();
}

/// 石を置ける場所のリストを作成する
pub fn getValidMoves(b: Board) BitBoard {
    const player_board = b.getPlayer();
    const opponent_board = b.getOpponent();
    const empty = player_board.unions(opponent_board).inversed();

    const mask = opponent_board.masks(BitBoard.fromString(
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
        .unions(getDirMoves(player_board, opponent_board, .ns))
        .unions(getDirMoves(player_board, mask, .nesw))
        .unions(getDirMoves(player_board, mask, .nwse))
        .masks(empty);
}

/// Dirで示された方向に挟める場所を探す
fn getDirMoves(board: BitBoard, mask: BitBoard, dir: BitBoard.Direction) BitBoard {
    var flip = board;
    flip = flip.move(dir).masks(mask);

    flip.setUnion(flip.move(dir).masks(mask));
    flip.setUnion(flip.move(dir).masks(mask));
    flip.setUnion(flip.move(dir).masks(mask));
    flip.setUnion(flip.move(dir).masks(mask));
    flip.setUnion(flip.move(dir).masks(mask));

    return flip.move(dir);
}

/// ゲームが終了しているか判定する。
/// どちらのプレイヤーも置く場所がなかったら終了
pub fn isEnd(b: Board) bool {
    if (!b.getValidMoves().isEmpty()) {
        return false;
    }

    const pass_board = Board{
        .black = b.black,
        .white = b.white,
        .nextColor = b.nextColor.turn(),
    };

    return pass_board.getValidMoves().isEmpty();
}

/// ボードの文字列からボード構造体を作る
/// oが黒石、xが白石、それ以外で空白を表す。
pub fn fromString(comptime str: []const u8) Board {
    return .{
        .black = BitBoard.fromString(str, 'o'),
        .white = BitBoard.fromString(str, 'x'),
    };
}
