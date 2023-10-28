const std = @import("std");

export fn add(a: u32, b: u32) u32 {
    return a +| b;
}

test "add test" {
    const testing = std.testing;

    try testing.expect(add(3, 4) == 7);
}
