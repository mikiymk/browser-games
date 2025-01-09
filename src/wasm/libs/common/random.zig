// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("./main.zig");

test {
    _ = @import("random.test.zig");
}

const S = struct {
    var rand_gen = std.rand.DefaultPrng.init(0xfe_dc_ba_98_76_54_32_10);
    const rand = rand_gen.random();
};

pub const random = S.rand;
pub fn getRandom() f64 {
    return S.rand.float(f64);
}

pub fn getRandomIntRange(at_least: usize, less_than: usize) usize {
    return S.rand.intRangeLessThan(usize, at_least, less_than);
}
