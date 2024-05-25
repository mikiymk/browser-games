const std = @import("std");
const builtin = @import("builtin");
const reversi = @import("libs/reversi/main.zig");
const Board = reversi.Board;
const ai = reversi.ai;

const common = @import("libs/common/main.zig");
const BitBoard = common.bit_board.BitBoard(8, 8);

/// アロケーター
const allocator = if (builtin.target.isWasm()) std.heap.wasm_allocator else std.heap.page_allocator;

/// Wasmではインポートしたランダム関数を使う
/// それ以外ではZigのライブラリの
pub fn getRandom() f64 {
    const S = struct {
        var rand_gen = std.rand.DefaultPrng.init(0xfe_dc_ba_98_76_54_32_10);
        var rand = rand_gen.random();
    };

    return S.rand.float(f64);
}

/// 新しいボードをアロケートしてポインタを返す。
/// メモリの開放に`deinit`を呼び出してください。
export fn init() ?*Board {
    const board = allocator.create(Board) catch return null;
    board.* = Board.init();

    return board;
}

/// ボードのメモリを破棄する。
export fn deinit(board: *Board) void {
    allocator.destroy(board);
}

/// ボードの現在状態から黒石の配置を取得する。
/// 配置はビットボードで表される。
export fn getBlack(b: *Board) u64 {
    return b.boards.get(.black).toInteger();
}

/// ボードの現在状態から白石の配置を取得する。
/// 配置はビットボードで表される。
export fn getWhite(b: *Board) u64 {
    return b.boards.get(.white).toInteger();
}

/// 次の手番で石を置くプレイヤーが黒かどうか取得する。
/// 黒の場合は`true`。
export fn isNextBlack(b: *Board) bool {
    return b.nextColor == .black;
}

/// 現在状態でゲームが終了しているか判定する。
export fn isGameEnd(b: *Board) bool {
    return b.isEnd();
}

/// インデックスで指定した場所に現在プレイヤーの石を配置し、それに続く処理を行う。
/// - 配置した石によって新しく挟まれた石をひっくり返す。
/// - 相手プレイヤーに有効手があれば現在プレイヤーを交代する。
/// - それ以外の場合、プレイヤーを交代せずに処理を終了する。
///
/// ゲームボードの現在状態が更新される。
export fn move(b: *Board, place: u8) void {
    b.moveMutate(BitBoard.fromIndex(place));

    b.nextColor = b.nextColor.turn();

    if (b.getValidMoves().isEmpty()) {
        b.nextColor = b.nextColor.turn();
    }
}

/// 現在プレイヤーの有効手を取得する。
/// 配置はビットボードで表される。
export fn getValidMoves(b: *Board) u64 {
    return b.getValidMoves().toInteger();
}

/// 現在のゲームボードからAIの考えた手を取得する。
export fn getAiMove(b: *Board) u8 {
    return ai.getAiMove(b.*, getRandom);
}
