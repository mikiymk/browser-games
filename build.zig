const std = @import("std");

const Dir = std.Build.Step.InstallArtifact.Options.Dir;

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const public_dir: Dir = .{ .override = .{ .custom = "../public/wasm" } };

    // build

    buildLib(b, "reversi", public_dir, target, optimize);
    buildLib(b, "chess-zig", public_dir, target, optimize);

    // test

    const test_step = b.step("test", "Run library tests");
    buildTest(b, "reversi", target, optimize, test_step);
    buildTest(b, "chess-zig", target, optimize, test_step);
}

fn buildLib(
    b: *std.Build,
    comptime name: []const u8,
    public_dir: Dir,
    target: std.zig.CrossTarget,
    optimize: std.builtin.OptimizeMode,
) void {
    const lib = b.addSharedLibrary(.{
        .name = name,
        .root_source_file = .{ .path = "src/wasms/" ++ name ++ "/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    // exports all "export" functions
    lib.rdynamic = true;

    const artifact = b.addInstallArtifact(lib, .{ .dest_dir = public_dir });
    const step = b.step(name, "Build " ++ name ++ " library");
    step.dependOn(&artifact.step);
}

fn buildTest(
    b: *std.Build,
    comptime name: []const u8,
    target: std.zig.CrossTarget,
    optimize: std.builtin.OptimizeMode,
    test_step: *std.Build.Step,
) void {
    const main_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/wasms/" ++ name ++ "/main.zig" },
        .target = target,
        .optimize = optimize,
    });
    const run_main_tests = b.addRunArtifact(main_tests);
    test_step.dependOn(&run_main_tests.step);
}
