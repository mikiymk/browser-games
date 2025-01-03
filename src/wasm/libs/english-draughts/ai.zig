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
const log = common.console.log;

const ai_depth = 5;

const DraughtsContext = struct {
    pub fn get_valid_moves(a: Allocator, game: Game) ![]Game.Move {
        const jumps = try game.board.getAllJumpMoves(a, game.next_color);
        if (jumps.len > 0) {
            return jumps;
        } else {
            return game.board.getAllWalkMoves(a, game.next_color);
        }
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
    defer a.free(moves);

    if (moves.len == 0) {
        return error.CanNotMove;
    }
    const i = random(0, moves.len);

    return moves[i];
}
