const std = @import("std");
const builtin = @import("builtin");
const Board = @import("./Board.zig");
const ai = @import("./ai.zig");

const allocator = if (builtin.target.isWasm()) std.heap.wasm_allocator else std.heap.page_allocator;

extern fn random() f64;

pub fn getRandom() f64 {
    if (builtin.target.isWasm()) {
        return random();
    } else {
        const S = struct {
            var rand_gen = std.rand.Xoroshiro128.init(0xfe_dc_ba_98_76_54_32_10);
            var rand = rand_gen.random();
        };

        return S.rand.float(f64);
    }
}

/// WASMテスト用の関数。
/// 2つの整数を足した合計の数を返す。
export fn add(a: u32, b: u32) u32 {
    return a +% b;
}

/// 新しいボードをアロケートしてポインタを返す。
/// メモリの開放に`deinit`を呼び出してください。
export fn init() ?*Board {
    var board = allocator.create(Board) catch return null;
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
    return b.black;
}

/// ボードの現在状態から白石の配置を取得する。
/// 配置はビットボードで表される。
export fn getWhite(b: *Board) u64 {
    return b.white;
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
    b.move(@as(u64, 1) << @truncate(place));

    b.nextColor = b.nextColor.turn();

    if (b.getValidMoves() == 0) {
        b.nextColor = b.nextColor.turn();
    }
}

/// 現在プレイヤーの有効手を取得する。
/// 配置はビットボードで表される。
export fn getValidMoves(b: *Board) u64 {
    return b.getValidMoves();
}

/// 現在のゲームボードからAIの考えた手を取得する。
export fn getAiMove(b: *Board) u8 {
    return ai.getAiMove(b.*);
}

test "test test" {
    const testing = std.testing;

    try testing.expect(add(3, 7) == 10);
}
