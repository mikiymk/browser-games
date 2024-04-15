const std = @import("std");
const builtin = @import("builtin");

extern fn consoleLog(ptr: [*]const u8, len: usize) void;

const WriteError = error{};
fn write(_: void, bytes: []const u8) WriteError!usize {
    consoleLog(bytes.ptr, bytes.len);
    return bytes.len;
}

// wasm以外では何もしない (テストの時はこっち)
fn noWrite(_: void, bytes: []const u8) WriteError!usize {
    return bytes.len;
}

const writeFn = if (builtin.target.isWasm()) write else noWrite;
const Writer = std.io.Writer(void, WriteError, writeFn);

const writer: Writer = .{ .context = void{} };

pub fn log(comptime fmt: []const u8, args: anytype) void {
    writer.print("zig output: " ++ fmt, args) catch {};
}
