import http from "http";
import { healthHandler } from "./routes/health";

const PORT = process.env.PORT ?? 3000;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    return healthHandler(req, res);
  }
  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
