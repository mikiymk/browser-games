const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;

const draughts = @import("../english-draughts/main.zig");
const Game = draughts.Game;
const Move = Game.Move;
const BitBoard = draughts.BitBoard;

// common import
const common = @import("../common/main.zig");
const random = common.random.getRandomIntRange;

const ai_depth = 5;

const DraughtsContext = struct {
    pub fn get_valid_moves(a: Allocator, game: Game) ![]Game.Move {
        var moves = std.ArrayList(Game.Move).init(a);

        const color = game.getColor();
        const moves_from = game.getBoard(color);
        var moves_from_iter = moves_from.iterator();
        while (moves_from_iter.next()) |pos_from| {
            const moves_to = game.getMove(BitBoard.fromInteger(pos_from));
            var moves_to_iter = moves_to.iterator();

            while (moves_to_iter.next()) |pos_to| {
                try moves.append(Game.Move.init(pos_from, pos_to, color));
            }
        }

        return moves.toOwnedSlice();
    }
};

pub fn ai(a: Allocator, game: *Game) !void {
    var ai_move = try getAiMove(a, game.*, DraughtsContext);

    while (game.setMoved(ai_move)) {
        ai_move = try getAiMove(a, game.*, DraughtsContext);
    }
}

/// AIが考えた打つ場所を返します。
///
/// ```zig
/// Context = {
///     fn get_valid_moves(a: Allocator, game: Game) ![]Move;
/// }
/// ```
pub fn getAiMove(a: Allocator, game: Game, Context: type) !Move {
    const moves = try Context.get_valid_moves(a, game);

    const i = random(0, moves.len);

    return moves[i];
}
