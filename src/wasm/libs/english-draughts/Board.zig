const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;
const EnumArray = std.enums.EnumArray;

const draughts = @import("../english-draughts/main.zig");
const Game = draughts.Game;
const Board = draughts.Board;
const BitBoard = draughts.BitBoard;
const Color = Game.Color;
const Piece = Game.Piece;

// common import
const common = @import("../common/main.zig");

const ColorBoard = EnumArray(Color, BitBoard);
const PieceColorBoard = EnumArray(Piece, ColorBoard);

boards: ColorBoard,

/// ボードを作成する。
pub fn init(a: Allocator, board_white: BitBoard, board_black: BitBoard) @This() {
    _ = a;

    return .{ .boards = ColorBoard.init(.{
        .white = board_white,
        .black = board_black,
    }) };
}

/// 文字列からボードを作成する。
/// 白はo、黒はxで指定する。
pub fn initFromString(a: Allocator, str: []const u8) @This() {
    const mark_white = 'o';
    const mark_black = 'x';

    const board_white = BitBoard.initWithString(str, mark_white);
    const board_black = BitBoard.initWithString(str, mark_black);

    return init(a, board_white, board_black);
}

/// 指定した色のボード状態を取得する
pub fn getBoard(self: Board, color: Color) BitBoard {
    return self.boards.get(color);
}

/// 指定した場所の駒の色を取得する
pub fn getColor(self: Board, position: BitBoard) ?Color {
    const white_board = self.getBoard(.white);
    const black_board = self.getBoard(.black);

    if (position.isJoint(white_board)) {
        return .white;
    } else if (position.isJoint(black_board)) {
        return .black;
    } else {
        return null;
    }
}

test "📖Board.getColor" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\........
        \\.....o..
        \\........
        \\........
        \\..x.....
        \\........
        \\........
    ;

    const board = Board.initFromString(a, board_str);

    try std.testing.expectEqual(.white, board.getColor(BitBoard.initWithCoordinate(5, 5)));
    try std.testing.expectEqual(.black, board.getColor(BitBoard.initWithCoordinate(2, 2)));
    try std.testing.expectEqual(null, board.getColor(BitBoard.initWithCoordinate(4, 4)));
}

/// 指定した座標の駒が移動できる範囲を取得する。
pub fn movedKingWalk(self: Board, position: BitBoard, color: Color) BitBoard {
    const ally_board = self.getBoard(color);
    const opponent_board = self.getBoard(color.turn());
    const occupied_positions = ally_board.unions(opponent_board);

    const move_to = position.moveMaskedMultiple(&.{ .ne, .se, .nw, .sw });

    return move_to.excludes(occupied_positions);
}

test "📖Board.movedKingWalk" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\........
        \\.....o..
        \\........
        \\........
        \\..x.....
        \\........
        \\........
    ;

    const board = Board.initFromString(a, board_str);

    try board.movedKingWalk(BitBoard.initWithCoordinate(1, 1), .white).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\o.......
        \\........
        \\o.o.....
    );

    try board.movedKingWalk(BitBoard.initWithCoordinate(6, 6), .white).expect(
        \\.....o.o
        \\........
        \\.......o
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}

/// 指定した座標の駒が相手の駒を飛び越えて移動できる範囲を取得する。
pub fn movedKingJump(self: Board, position: BitBoard, color: Color) BitBoard {
    const ally_board = self.getBoard(color);
    const opponent_board = self.getBoard(color.turn());
    const occupied_positions = ally_board.unions(opponent_board);

    var move_jump = BitBoard.init();

    const directions = [_]BitBoard.Direction{ .ne, .se, .nw, .sw };
    for (directions) |direction| {
        const intermediate_position = position.moveMasked(direction).masks(opponent_board);

        move_jump.setUnion(intermediate_position.moveMasked(direction));
    }

    return move_jump.excludes(occupied_positions);
}

test "📖Board.getMoveJump" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\........
        \\.x......
        \\..x.o...
        \\...o....
        \\..x.....
        \\........
        \\........
    ;

    const board = Board.initFromString(a, board_str);

    try board.movedKingJump(BitBoard.initWithCoordinate(3, 3), .white).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\.o......
        \\........
    );
}

/// 指定した位置の駒を反転させる
fn togglePiece(self: *Board, position: BitBoard, color: Color) void {
    self.boards.getPtr(color).setToggle(position);
}

/// 駒を移動させる
pub fn setMovedWalk(self: *Board, position_from: BitBoard, position_to: BitBoard, color: Color) void {
    self.togglePiece(position_from, color);
    self.togglePiece(position_to, color);
}

test "📖Board.setMovedWalk" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\...o....
        \\..x.....
        \\........
        \\........
    ;

    var board = Board.initFromString(a, board_str);
    board.setMovedWalk(BitBoard.initWithCoordinate(3, 3), BitBoard.initWithCoordinate(4, 4), .white);

    try board.getBoard(.white).expect(
        \\........
        \\........
        \\........
        \\....o...
        \\........
        \\........
        \\........
        \\........
    );
}

/// 駒を移動させ、途中の相手の駒を取りのぞく
pub fn setMovedJump(self: *Board, position_from: BitBoard, position_to: BitBoard, position_jumped: BitBoard, color: Color) void {
    self.togglePiece(position_from, color);
    self.togglePiece(position_jumped, color.turn());
    self.togglePiece(position_to, color);
}

test "📖Board.setMovedJump" {
    const a = std.testing.allocator;
    const board_str =
        \\........
        \\........
        \\........
        \\........
        \\...o....
        \\..x.....
        \\........
        \\........
    ;

    var board = Board.initFromString(a, board_str);
    board.setMovedJump(
        BitBoard.initWithCoordinate(3, 3),
        BitBoard.initWithCoordinate(1, 1),
        BitBoard.initWithCoordinate(2, 2),
        .white,
    );

    try board.getBoard(.white).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\.o......
        \\........
    );
    try board.getBoard(.black).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
        \\........
    );
}
