const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const public_dir: std.Build.Step.InstallArtifact.Options.Dir = .{ .override = .{ .custom = "../public/wasm" } };

    // reversi

    const reversi = b.addSharedLibrary(.{
        .name = "reversi",
        .root_source_file = .{ .path = "src/wasms/reversi/main.zig" },
        .target = target,
        .optimize = optimize,
    });

    // exports all "export" functions
    reversi.rdynamic = true;

    const reversi_artifact = b.addInstallArtifact(reversi, .{ .dest_dir = public_dir });
    const reversi_step = b.step("reversi", "Build reversi library");
    reversi_step.dependOn(&reversi_artifact.step);

    // test

    const main_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/wasms/test.zig" },
        .target = target,
        .optimize = optimize,
    });
    const run_main_tests = b.addRunArtifact(main_tests);
    const test_step = b.step("test", "Run library tests");
    test_step.dependOn(&run_main_tests.step);
}
