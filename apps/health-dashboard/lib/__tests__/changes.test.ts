import fs from "fs/promises";
import os from "os";
import path from "path";
import {
  listActiveChanges,
  getArtifactCount,
  buildChangeStats,
} from "../changes";

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "openspec-test-"));
}

describe("listActiveChanges", () => {
  it("returns active change names excluding archive", async () => {
    const dir = await makeTempDir();
    await fs.mkdir(path.join(dir, "change-a"));
    await fs.mkdir(path.join(dir, "change-b"));
    await fs.mkdir(path.join(dir, "archive"));

    const result = await listActiveChanges(dir);
    expect(result.sort()).toEqual(["change-a", "change-b"]);
    await fs.rm(dir, { recursive: true });
  });

  it("returns empty array when only archive exists", async () => {
    const dir = await makeTempDir();
    await fs.mkdir(path.join(dir, "archive"));

    const result = await listActiveChanges(dir);
    expect(result).toEqual([]);
    await fs.rm(dir, { recursive: true });
  });
});

describe("getArtifactCount", () => {
  it("counts done vs total for a partially complete change", async () => {
    const dir = await makeTempDir();
    await fs.writeFile(path.join(dir, "proposal.md"), "");
    await fs.writeFile(path.join(dir, "design.md"), "");
    // tasks.md intentionally missing

    const result = await getArtifactCount(dir);
    expect(result).toEqual({ done: 2, total: 3 });
    await fs.rm(dir, { recursive: true });
  });
});

describe("buildChangeStats response shape", () => {
  it("returns correct shape for two active changes", async () => {
    const dir = await makeTempDir();
    await fs.writeFile(path.join(dir, "proposal.md"), "");

    const stats = await buildChangeStats(dir, "test-change");
    expect(stats).toMatchObject({
      name: "test-change",
      status: expect.stringMatching(/complete|in-progress/),
      artifactCount: { done: expect.any(Number), total: expect.any(Number) },
      lastUpdated: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    });
    await fs.rm(dir, { recursive: true });
  });
});
