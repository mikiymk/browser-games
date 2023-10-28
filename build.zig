const std = @import("std");

const Dir = std.Build.Step.InstallArtifact.Options.Dir;
const ModuleStructs = struct { name: []const u8, module: *std.build.Module };

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const public_dir: Dir = .{ .override = .{ .custom = "../public/wasm" } };

    var modules = [_]ModuleStructs{
        buildModule(b, "bit-board"),
    };

    // build

    buildLib(b, "reversi", public_dir, target, optimize, &modules);
    buildLib(b, "chess-zig", public_dir, target, optimize, &modules);

    // test

    const test_step = b.step("test", "Run library tests");
    buildTest(b, "reversi", target, optimize, test_step, &modules);
    buildTest(b, "chess-zig", target, optimize, test_step, &modules);
}

fn buildLib(
    b: *std.Build,
    comptime name: []const u8,
    public_dir: Dir,
    target: std.zig.CrossTarget,
    optimize: std.builtin.OptimizeMode,
    modules: []ModuleStructs,
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

    for (modules) |module| {
        lib.addModule(module.name, module.module);
    }
}

fn buildTest(
    b: *std.Build,
    comptime name: []const u8,
    target: std.zig.CrossTarget,
    optimize: std.builtin.OptimizeMode,
    test_step: *std.Build.Step,
    modules: []ModuleStructs,
) void {
    const main_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/wasms/" ++ name ++ "/main.zig" },
        .target = target,
        .optimize = optimize,
    });
    const run_main_tests = b.addRunArtifact(main_tests);
    test_step.dependOn(&run_main_tests.step);

    for (modules) |module| {
        main_tests.addModule(module.name, module.module);
    }
}

fn buildModule(
    b: *std.Build,
    comptime name: []const u8,
) ModuleStructs {
    return .{
        .name = name,
        .module = b.addModule(name, .{ .source_file = .{ .path = "src/wasms/" ++ name ++ "/main.zig" } }),
    };
}
