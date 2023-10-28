test {
    const testing = @import("std").testing;

    testing.refAllDecls(@import("reversi/main.zig"));
    testing.refAllDecls(@import("chess/main.zig"));
}
