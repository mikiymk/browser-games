// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("./main.zig");

const S = struct {
    var rand_gen = std.Random.DefaultPrng.init(0xfe_dc_ba_98_76_54_32_10);
    const rand = rand_gen.random();
};

pub const random = S.rand;

/// ランダムのシードを設定します。
export fn setSeed(seed: usize) void {
    S.rand_gen.seed(seed);
}

/// ランダムな浮動小数点数を取得します。
pub fn getRandom() f64 {
    return S.rand.float(f64);
}

/// 指定した範囲の整数をランダムに取得します。
pub fn getRandomIntRange(at_least: usize, less_than: usize) usize {
    return S.rand.intRangeLessThan(usize, at_least, less_than);
}

/// スライスからランダムな要素を取得します。
pub fn getRandomItem(slice: anytype) usize {
    return slice[getRandomIntRange(0, slice.len)];
}
