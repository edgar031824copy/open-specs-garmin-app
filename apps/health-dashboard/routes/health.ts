import { IncomingMessage, ServerResponse } from "http";
import { buildChangeStats, listActiveChanges } from "../lib/changes";
import path from "path";

const CHANGES_DIR = path.resolve(__dirname, "../../../openspec/changes");

export async function healthHandler(
  _req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const names = await listActiveChanges(CHANGES_DIR);
  const stats = await Promise.all(
    names.map((name) =>
      buildChangeStats(path.join(CHANGES_DIR, name), name).catch(() => null)
    )
  );

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(stats.filter(Boolean)));
}
