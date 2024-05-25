const std = @import("std");

const Build = std.Build;
const Dir = Build.Step.InstallArtifact.Options.Dir;
const Target = std.Build.ResolvedTarget;
const Optimize = std.builtin.OptimizeMode;

pub fn build(b: *Build) void {
    const target: Target = b.standardTargetOptions(.{});
    const optimize: Optimize = b.standardOptimizeOption(.{});

    const public_dir: Dir = .{ .override = .{ .custom = "../public/wasm" } };

    // build
    const build_all = b.step("all", "Build all library");

    const build_reversi = buildLib(b, "reversi", public_dir, target, optimize);
    const build_chess = buildLib(b, "chess", public_dir, target, optimize);
    const build_shogi = buildLib(b, "shogi", public_dir, target, optimize);

    build_all.dependOn(build_reversi);
    build_all.dependOn(build_chess);
    build_all.dependOn(build_shogi);

    // test
    buildTest(b);
}

fn buildLib(b: *Build, comptime name: []const u8, public_dir: Dir, target: Target, optimize: Optimize) *Build.Step {
    if (target.result.isWasm()) {
        const exe = b.addExecutable(.{
            .name = name,
            .root_source_file = .{ .path = "src/wasm/" ++ name ++ ".zig" },
            .target = target,
            .optimize = optimize,

            .strip = true,
        });

        // exports all "export" functions
        exe.rdynamic = true;
        // no-entry
        exe.entry = .disabled;

        const artifact = b.addInstallArtifact(exe, .{ .dest_dir = public_dir });
        const step = b.step(name, "Build " ++ name ++ " library");
        step.dependOn(&artifact.step);

        return step;
    } else {
        const lib = b.addSharedLibrary(.{
            .name = name,
            .root_source_file = .{ .path = "src/wasm/" ++ name ++ ".zig" },
            .target = target,
            .optimize = optimize,

            .strip = true,
        });

        // exports all "export" functions
        lib.rdynamic = true;

        const artifact = b.addInstallArtifact(lib, .{ .dest_dir = public_dir });
        const step = b.step(name, "Build " ++ name ++ " library");
        step.dependOn(&artifact.step);

        return step;
    }
}

fn buildTest(b: *Build) void {
    const test_step = b.step("test", "Run library tests");

    const main_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/wasm/test.zig" },
    });
    const run_main_tests = b.addRunArtifact(main_tests);
    test_step.dependOn(&run_main_tests.step);
}
