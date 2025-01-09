const std = @import("std");
const builtin = @import("builtin");
const reversi = @import("libs/reversi/main.zig");
const Board = reversi.Board;
const ai = reversi.ai;

const common = @import("libs/common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);
const a = common.allocator;
const getRandom = common.random.getRandom;

/// 新しいボードをアロケートしてポインタを返す。
/// メモリの開放に`deinit`を呼び出してください。
export fn init() ?*Board {
    const board = a.create(Board) catch return null;
    board.* = Board.init();

    return board;
}

/// ボードのメモリを破棄する。
export fn deinit(board: *Board) void {
    a.destroy(board);
}

/// ボードの現在状態から黒石の配置を取得する。
/// 配置はビットボードで表される。
export fn getBlack(board: *Board) u64 {
    return board.boards.get(.black).toInteger();
}

/// ボードの現在状態から白石の配置を取得する。
/// 配置はビットボードで表される。
export fn getWhite(board: *Board) u64 {
    return board.boards.get(.white).toInteger();
}

/// 次の手番で石を置くプレイヤーが黒かどうか取得する。
/// 黒の場合は`true`。
export fn isNextBlack(board: *Board) bool {
    return board.nextColor == .black;
}

/// 現在状態でゲームが終了しているか判定する。
export fn isGameEnd(board: *Board) bool {
    return board.isEnd();
}

/// インデックスで指定した場所に現在プレイヤーの石を配置し、それに続く処理を行う。
/// - 配置した石によって新しく挟まれた石をひっくり返す。
/// - 相手プレイヤーに有効手があれば現在プレイヤーを交代する。
/// - それ以外の場合、プレイヤーを交代せずに処理を終了する。
///
/// ゲームボードの現在状態が更新される。
export fn move(board: *Board, place: u8) void {
    board.moveMutate(BitBoard.initWithIndex(place));
}

/// 現在プレイヤーの有効手を取得する。
/// 配置はビットボードで表される。
export fn getValidMoves(board: *Board) u64 {
    return board.getValidMoves().toInteger();
}

/// 現在のゲームボードからAIの考えた手を取得する。
export fn getAiMove(board: *Board) u8 {
    return ai.getAiMove(board.*, getRandom);
}
