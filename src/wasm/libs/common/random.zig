// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("./main.zig");

fn getRamdom() f64 {
    const S = struct {
        var rand_gen = std.rand.DefaultPrng.init(0xfe_dc_ba_98_76_54_32_10);
        var rand = rand_gen.random();
    };

    return S.rand.float(f64);
}
