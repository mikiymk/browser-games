const std = @import("std");

const Dir = std.Build.Step.InstallArtifact.Options.Dir;

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const public_dir: Dir = .{ .override = .{ .custom = "../public/wasm" } };

    // build

    buildLib(b, "reversi", public_dir, target, optimize);
    buildLib(b, "chess", public_dir, target, optimize);

    // test
    buildTest(b, target, optimize);
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
        .root_source_file = .{ .path = "src/wasm/" ++ name ++ ".zig" },
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
    target: std.zig.CrossTarget,
    optimize: std.builtin.OptimizeMode,
) void {
    const test_step = b.step("test", "Run library tests");

    const main_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/wasm/test.zig" },
        .target = target,
        .optimize = optimize,
    });
    const run_main_tests = b.addRunArtifact(main_tests);
    test_step.dependOn(&run_main_tests.step);
}
