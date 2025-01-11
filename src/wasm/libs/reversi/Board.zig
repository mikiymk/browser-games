// std import
const std = @import("std");
const builtin = @import("builtin");

pub const ColorBoards = std.enums.EnumArray(Color, BitBoard);

// common import
const common = @import("../common/main.zig");
pub const BitBoard = common.bit_board.BitBoard(8, 8);
pub const Direction = BitBoard.Direction;

// internal import

// test import
test {
    _ = @import("./Board.test.zig");
}

const Board = @This();

// properties

boards: ColorBoards = ColorBoards.initDefault(BitBoard.init(), .{}),

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

/// ボードの文字列からボード構造体を作る
/// oが黒石、xが白石、それ以外で空白を表す。
pub fn fromString(comptime str: []const u8) Board {
    return .{
        .boards = ColorBoards.init(.{
            .black = BitBoard.fromString(str, 'o'),
            .white = BitBoard.fromString(str, 'x'),
        }),
    };
}

/// 現在のプレイヤー側のビットボードを取得する
pub fn getPlayer(board: Board) BitBoard {
    return board.boards.get(board.nextColor);
}

/// 現在の相手側のビットボードを取得する
pub fn getOpponent(board: Board) BitBoard {
    return board.boards.get(board.nextColor.turn());
}

/// 場所に置いた時、ひっくり返す石を求める
fn getFlipSquares(board: Board, place: BitBoard) BitBoard {
    const player_board = board.getPlayer();
    const opponent_board = board.getOpponent();

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
pub fn moveMutate(board: *Board, place: BitBoard) void {
    const flip = board.getFlipSquares(place);

    board.boards.getPtr(.black).setToggle(flip);
    board.boards.getPtr(.white).setToggle(flip);
    board.boards.getPtr(board.nextColor).setUnion(place);
    board.nextColor = board.nextColor.turn();

    if (board.getValidMoves().isEmpty()) {
        board.nextColor = board.nextColor.turn();
    }
}

/// Placeで示された場所に石を置く。
/// 既に置いてある石でひっくり返す石がある場合は、それをひっくり返す。
/// ボードを更新する
pub fn move(board: Board, place: BitBoard) Board {
    var new_board = board;
    new_board.moveMutate(place);

    return new_board;
}

/// Dirで示された方向にひっくり返す石を探す。
fn moveDir(player_board: BitBoard, place: BitBoard, mask: BitBoard, dir: Direction) BitBoard {
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
pub fn getValidMoves(board: Board) BitBoard {
    const player_board = board.getPlayer();
    const opponent_board = board.getOpponent();
    const empty = player_board.unions(opponent_board).getInverted();

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

    return getDirMoves(player_board, mask, &.{ .e, .w })
        .unions(getDirMoves(player_board, opponent_board, &.{ .n, .s }))
        .unions(getDirMoves(player_board, mask, &.{ .ne, .sw }))
        .unions(getDirMoves(player_board, mask, &.{ .nw, .se }))
        .masks(empty);
}

/// Dirで示された方向に挟める場所を探す
fn getDirMoves(board: BitBoard, mask: BitBoard, dirs: []const Direction) BitBoard {
    var flip = board;
    flip = flip.moveMultiple(dirs).masks(mask);

    flip.setUnion(flip.moveMultiple(dirs).masks(mask));
    flip.setUnion(flip.moveMultiple(dirs).masks(mask));
    flip.setUnion(flip.moveMultiple(dirs).masks(mask));
    flip.setUnion(flip.moveMultiple(dirs).masks(mask));
    flip.setUnion(flip.moveMultiple(dirs).masks(mask));

    return flip.moveMultiple(dirs);
}

/// ゲームが終了しているか判定する。
/// どちらのプレイヤーも置く場所がなかったら終了
pub fn isEnd(board: Board) bool {
    if (!board.getValidMoves().isEmpty()) {
        return false;
    }

    const pass_board = Board{
        .boards = board.boards,
        .nextColor = board.nextColor.turn(),
    };

    return pass_board.getValidMoves().isEmpty();
}
