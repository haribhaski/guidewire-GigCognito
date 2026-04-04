import express from "express";
import { getWorkerDashboard } from "../services/worker/worker-dashboard.service";
import { getLiveDashboardByZone } from "../services/worker/worker-dashboard.service";
import { authenticateWorker } from "../middlewares/authenticateWorker";

const router = express.Router();

// GET /api/worker-dashboard/overview
router.get("/overview", authenticateWorker, async (req, res) => {
  const workerId = req.user.id;
  const zoneId = req.user.zoneId || "BLR_KOR_01";
  try {
    const dashboard = await getWorkerDashboard(workerId, zoneId);
    if (!dashboard || !dashboard.zone) {
      return res.status(404).json({ success: false, message: "Dashboard data not found" });
    }
    return res.json(dashboard);
  } catch (err) {
    console.error("[worker-dashboard/overview]", err);
    return res.status(500).json({ success: false, message: "Failed to fetch dashboard" });
  }
});

// GET /api/worker-dashboard/live-overview?zoneId=BLR_KOR_01
router.get("/live-overview", async (req, res) => {
  const zoneId = typeof req.query.zoneId === "string" && req.query.zoneId.trim()
    ? req.query.zoneId.trim()
    : "BLR_KOR_01";

  try {
    const dashboard = await getLiveDashboardByZone(zoneId);
    return res.json(dashboard);
  } catch (err) {
    console.error("[worker-dashboard/live-overview]", err);
    return res.status(500).json({ success: false, message: "Failed to fetch live dashboard" });
  }
});

export default router;
