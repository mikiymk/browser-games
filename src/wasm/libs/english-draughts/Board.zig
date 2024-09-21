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

    var board_white = BitBoard.init();
    var board_black = BitBoard.init();
    var board_index: usize = 0;

    for (str, 0..) |c, i| {
        if (i % 9 == 8) {
            std.debug.assert(c == '\n' or c == 0);
            continue;
        }

        if (c == mark_white) {
            board_white.setToggleIndex(board_index);
        } else if (c == mark_black) {
            board_black.setToggleIndex(board_index);
        }
        board_index += 1;
    }

    return init(a, board_white, board_black);
}

/// 指定した色のボード状態を取得する
pub fn getBoard(self: Board, color: Color) BitBoard {
    return self.boards.get(color);
}
