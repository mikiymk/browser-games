test {
    const testing = @import("std").testing;

    testing.refAllDecls(@import("reversi/main.zig"));
}
