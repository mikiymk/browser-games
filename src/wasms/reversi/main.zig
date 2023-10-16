export fn add(a: u32, b: u32) u32 {
    return a +% b;
}

test "add test" {
    const testing = @import("std").testing;

    try testing.expect(add(3, 7) == 10);
}
