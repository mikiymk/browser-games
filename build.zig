const std = @import("std");

const Build = std.Build;
const Dir = Build.Step.InstallArtifact.Options.Dir;
const Target = std.Build.ResolvedTarget;
const Optimize = std.builtin.OptimizeMode;

const public_dir: Dir = .{ .override = .{ .custom = "../public/wasm" } };

pub fn build(b: *Build) void {
    const target: Target = b.standardTargetOptions(.{ .default_target = .{
        .cpu_arch = .wasm32,
        .os_tag = .freestanding,
    } });
    const optimize: Optimize = b.standardOptimizeOption(.{});

    // build
    const build_all = b.step("all", "Build all library");

    const names = [_][]const u8{
        "reversi",
        "chess",
        "shogi",
        "english-draughts",
        "nought-and-cross",
    };
    inline for (names) |name| {
        const step = buildLib(b, name, target, optimize);
        build_all.dependOn(step);
    }

    // test
    buildTest(b);

    b.default_step = build_all;
}

fn source(comptime name: []const u8) []const u8 {
    return "src-zig/" ++ name ++ ".zig";
}

fn buildLib(b: *Build, comptime name: []const u8, target: Target, optimize: Optimize) *Build.Step {
    const step = b.step(name, "Build " ++ name ++ " library");

    const exe = b.addExecutable(.{
        .name = name,
        .root_source_file = b.path(source(name)),
        .target = target,
        .optimize = optimize,
        // Omit debug symbols
        .strip = true,
    });

    // exports all "export" functions
    exe.rdynamic = true;
    // no-entry
    exe.entry = .disabled;

    const artifact = b.addInstallArtifact(exe, .{ .dest_dir = public_dir });
    step.dependOn(&artifact.step);
    return step;
}

fn buildTest(b: *Build) void {
    const test_step = b.step("test", "Run library tests");

    const main_tests = b.addTest(.{
        .root_source_file = b.path(source("test")),
    });
    const run_main_tests = b.addRunArtifact(main_tests);
    test_step.dependOn(&run_main_tests.step);
}
