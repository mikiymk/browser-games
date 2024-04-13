const std = @import("std");

extern fn consoleLog(ptr: [*]const u8, len: usize) void;

const WriteError = error{};
fn write(_: void, bytes: []const u8) WriteError!usize {
    consoleLog(bytes.ptr, bytes.len);
    return bytes.len;
}
const Writer = std.io.Writer(void, WriteError, write);
const writer: Writer = .{ .context = void{} };

pub fn log(comptime fmt: []const u8, args: anytype) void {
    writer.print("zig output: " ++ fmt, args) catch {};
}
