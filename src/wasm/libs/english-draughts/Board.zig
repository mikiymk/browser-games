const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;
const EnumArray = std.enums.EnumArray(Color, BitBoard);

const draughts = @import("../english-draughts/main.zig");
const Game = draughts.Game;
const Board = draughts.Board;
const BitBoard = draughts.BitBoard;
const Color = Game.Color;

// common import
const common = @import("../common/main.zig");

boards: EnumArray,

/// ボードを作成する。
pub fn init(a: Allocator, board_white: BitBoard, board_black: BitBoard) @This() {
    _ = a;

    return .{ .boards = EnumArray.init(.{
        .white = board_white,
        .black = board_black,
    }) };
}

/// 文字列からボードを作成する。
/// 白はo、黒はxで指定する。
pub fn initFromString(a: Allocator, str: []const u8) @This() {
    const mark_white = 'o';
    const mark_black = 'x';

    const board_white = BitBoard.fromString(str, mark_white);
    const board_black = BitBoard.fromString(str, mark_black);

    return init(a, board_white, board_black);
}

/// 指定した色のボード状態を取得する
pub fn getBoard(self: Board, color: Color) BitBoard {
    return self.boards.get(color);
}

/// 指定した座標の駒が移動できる範囲を取得する。
pub fn getMoveWark(self: Board, position: BitBoard, color: Color) BitBoard {
    const ally_board = self.getBoard(color);
    const opponent_board = self.getBoard(color.turn());
    const occupied_positions = ally_board.unions(opponent_board);

    const move_to = position.moveMultiple(&.{ .ne, .se, .nw, .sw });

    return move_to.excludes(occupied_positions);
}

test getMoveWark {
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

    try board.getMoveWark(BitBoard.fromCoordinate(1, 1), .white).expect(
        \\........
        \\........
        \\........
        \\........
        \\........
        \\o.......
        \\........
        \\o.o.....
    );

    try board.getMoveWark(BitBoard.fromCoordinate(6, 6), .white).expect(
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
pub fn getMoveJump(self: Board, position: BitBoard, color: Color) BitBoard {
    const ally_board = self.getBoard(color);
    const opponent_board = self.getBoard(color.turn());
    const occupied_positions = ally_board.unions(opponent_board);

    var move_jump = BitBoard.init();

    const directions = [_]BitBoard.Direction{ .ne, .se, .nw, .sw };
    for (directions) |direction| {
        const intermediate_position = position.move(direction).masks(opponent_board);

        move_jump.setUnion(intermediate_position.move(direction));
    }

    return move_jump.excludes(occupied_positions);
}

test getMoveJump {
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

    try board.getMoveJump(BitBoard.fromCoordinate(3, 3), .white).expect(
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
