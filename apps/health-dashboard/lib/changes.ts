import fs from "fs/promises";
import path from "path";

const SCHEMA_ARTIFACTS = ["proposal.md", "design.md", "tasks.md"];

export async function listActiveChanges(changesDir: string): Promise<string[]> {
  const entries = await fs.readdir(changesDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && e.name !== "archive")
    .map((e) => e.name);
}

export async function getArtifactCount(
  changeDir: string
): Promise<{ done: number; total: number }> {
  const total = SCHEMA_ARTIFACTS.length;
  const checks = await Promise.all(
    SCHEMA_ARTIFACTS.map((f) =>
      fs
        .access(path.join(changeDir, f))
        .then(() => true)
        .catch(() => false)
    )
  );
  return { done: checks.filter(Boolean).length, total };
}

export async function getLastUpdated(changeDir: string): Promise<string> {
  const entries = await fs.readdir(changeDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile());
  const mtimes = await Promise.all(
    files.map((f) =>
      fs.stat(path.join(changeDir, f.name)).then((s) => s.mtimeMs)
    )
  );
  const latest = Math.max(...mtimes);
  return new Date(latest).toISOString();
}

export async function buildChangeStats(
  changeDir: string,
  name: string
): Promise<{
  name: string;
  status: string;
  artifactCount: { done: number; total: number };
  lastUpdated: string;
}> {
  const artifactCount = await getArtifactCount(changeDir);
  const lastUpdated = await getLastUpdated(changeDir);
  const status =
    artifactCount.done === artifactCount.total ? "complete" : "in-progress";
  return { name, status, artifactCount, lastUpdated };
}
