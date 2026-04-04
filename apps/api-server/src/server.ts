import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "apps/api-server/.env"),
  path.resolve(__dirname, "../.env"),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

import app from "./app";
import { startTriggerPoller } from "./services/trigger/trigger-poller.service";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  startTriggerPoller();
});
