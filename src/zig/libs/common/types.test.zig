// std import
const std = @import("std");
const builtin = @import("builtin");
const testing = std.testing;

// common import
const common = @import("./main.zig");
const types = common.types;

test "UInt: ビット数を指定した符号無し整数" {
    const U31 = types.UInt(31);

    try testing.expect(U31 == u31);
}

test "Int: ビット数を指定した符号有り整数" {
    const I31 = types.Int(31);

    try testing.expect(I31 == i31);
}
