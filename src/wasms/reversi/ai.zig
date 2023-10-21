const std = @import("std");

const Board = @import("./Board.zig");
const random = @import("./main.zig").getRandom;

pub fn getAiMove(b: Board) u6 {
    const moves = b.getValidMoves();

    const moves_count: f64 = @floatFromInt(@popCount(moves));

    const random_number: f64 = random();

    const select_number: u6 = @intFromFloat(random_number * moves_count);

    var count: u6 = 0;
    var move_board = moves;
    while (move_board != 0) {
        if (count == select_number) {
            return @truncate(@popCount((move_board & (~move_board + 1)) - 1));
        }

        count += 1;
        move_board &= move_board - 1;
    }

    // 見つからなかった場合
    return 0;
}

test "get random move with AI" {
    const testing = std.testing;

    var board = Board.fromString(
        \\........
        \\........
        \\........
        \\...ox...
        \\...xo...
        \\........
        \\........
        \\........
    );

    var expected: u64 = comptime Board.bit_board.fromString(
        \\........
        \\........
        \\....o...
        \\.....o..
        \\..o.....
        \\...o....
        \\........
        \\........
    , 'o');
    var actual = @as(u64, 1) << getAiMove(board);

    testing.expect(actual & expected != 0) catch {
        const print = std.debug.print;
        const boardToString = Board.bit_board.toString;

        print("expected {x:0>16}\n{s}\n\n", .{ expected, boardToString(expected, 'o', '.') });
        print("actual {x:0>16}\n{s}\n\n", .{ actual, boardToString(actual, 'o', '.') });

        return error.UnexpectedBoard;
    };
}
