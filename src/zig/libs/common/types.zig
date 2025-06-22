// std import
const std = @import("std");
const builtin = @import("builtin");

// common import
const common = @import("./main.zig");

// test import
test {
    _ = @import("./types.test.zig");
}

pub fn UInt(comptime bits: u16) type {
    return @Type(.{ .int = .{
        .signedness = .unsigned,
        .bits = bits,
    } });
}

pub fn Int(comptime bits: u16) type {
    return @Type(.{ .int = .{
        .signedness = .signed,
        .bits = bits,
    } });
}
